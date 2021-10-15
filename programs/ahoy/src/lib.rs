use anchor_lang::prelude::*;

declare_id!("AHY7Dybe8eBiri3EAut4KPWtVNc7hoZHtbVNJh9EUmsm");

const ONE_DAY: u64 = 86_400;

#[program]
pub mod ahoy {
    use super::*;

    pub fn register(ctx: Context<Register>, _tag: TagHash, bump: u8) -> ProgramResult {
        let anchorite = &mut ctx.accounts.anchorite;
        anchorite.owner = ctx.accounts.owner.key();
        anchorite.last_gm = u64::default();
        anchorite.bump = [bump];
        Ok(())
    }

    pub fn deregister(_ctx: Context<Deregister>, _tag: TagHash) -> ProgramResult {
        Ok(())
    }

    pub fn gm(ctx: Context<GM>, _tag: TagHash) -> ProgramResult {
        let anchorite = &mut ctx.accounts.anchorite;
        let current_time = ctx.accounts.clock.unix_timestamp as u64;

        let elapsed_since: u64 = current_time.checked_sub(anchorite.last_gm).unwrap();

        if elapsed_since <= ONE_DAY {
            return Err(ErrorCode::MultipleAttemptsInOneDay.into());
        } else if elapsed_since > ONE_DAY * 2 {
            anchorite.streak = 0;
        }

        anchorite.last_gm = ctx.accounts.clock.unix_timestamp as u64;
        anchorite.streak = anchorite.streak.checked_add(1).unwrap();
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(tag: TagHash, bump: u8)]
pub struct Register<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        seeds = [
            b"anchorite",
            tag.value.as_ref(),
            owner.key().as_ref()
        ],
        bump = bump,
        space = 8 + 1 + 8 + 32 + 2,
    )]
    pub anchorite: Box<Account<'info, Anchorite>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(tag: TagHash)]
pub struct Deregister<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        seeds = [
            b"anchorite",
            tag.value.as_ref(),
            owner.key().as_ref()
        ],
        bump = anchorite.bump[0],
        has_one = owner,
        close = owner,
    )]
    pub anchorite: Account<'info, Anchorite>,
}

#[derive(Accounts)]
#[instruction(tag: TagHash)]
pub struct GM<'info> {
    pub authority: Signer<'info>,
    pub owner: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [
            b"anchorite",
            tag.value.as_ref(),
            owner.key().as_ref()
        ],
        bump = anchorite.bump[0],
        has_one = owner,
    )]
    pub anchorite: Box<Account<'info, Anchorite>>,

    pub clock: Sysvar<'info, Clock>,
}

#[account]
pub struct Anchorite {
    pub bump: [u8; 1],
    pub last_gm: u64,
    pub owner: Pubkey,
    pub streak: u16,
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct TagHash {
    pub value: [u8; 8],
}

#[error]
pub enum ErrorCode {
    #[msg("user has gm'ed more than once in a single day")]
    MultipleAttemptsInOneDay,
}

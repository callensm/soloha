// Copyright 2021 Matthew Callens
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use anchor_lang::prelude::*;

use crate::{seeds, State, TagHash};

#[derive(Accounts)]
#[instruction(tag: TagHash, bump: u8)]
pub struct Register<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        seeds = [
            seeds::STATE
        ],
        bump = state.bump[0],
    )]
    pub state: Box<Account<'info, State>>,

    #[account(
        init,
        payer = owner,
        seeds = [
            seeds::ANCHORITE,
            tag.value.as_ref()
        ],
        bump = bump,
        space = 8 + 1 + 8 + 32 + 2 + 2,
    )]
    pub anchorite: Box<Account<'info, Anchorite>>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Anchorite {
    pub bump: [u8; 1],
    pub last_gm: u64,
    pub owner: Pubkey,
    pub streak: u16,
    pub total: u16,
}

#[event]
pub struct NewAnchorite {
    #[index]
    pub pubkey: Pubkey,
}

pub fn handler(ctx: Context<Register>, _tag: TagHash, bump: u8) -> ProgramResult {
    let anchorite = &mut ctx.accounts.anchorite;
    anchorite.owner = ctx.accounts.owner.key();
    anchorite.last_gm = u64::default();
    anchorite.bump = [bump];

    let state = &mut ctx.accounts.state;
    state.registered = state.registered.checked_add(1).unwrap();

    emit!(NewAnchorite {
        pubkey: anchorite.key()
    });

    Ok(())
}

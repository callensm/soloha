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

mod error;
mod event;
mod instructions;

use instructions::*;

declare_id!("LHAPYTbqXFzkNxojt16Mx5gtAnnbhkZfMyLvU9xsKVe");

mod seeds {
    pub const STATE: &[u8] = b"state";
    pub const USER: &[u8] = b"user";
}

#[program]
pub mod soloha {
    use super::*;

    pub fn initialize(ctx: Context<InitializeState>, bump: u8) -> ProgramResult {
        instructions::initialize::handler(ctx, bump)
    }

    pub fn register(ctx: Context<Register>, tag: TagHash, bump: u8) -> ProgramResult {
        instructions::register::handler(ctx, tag, bump)
    }

    pub fn deregister(ctx: Context<Deregister>, tag: TagHash) -> ProgramResult {
        instructions::deregister::handler(ctx, tag)
    }

    pub fn gm(ctx: Context<GM>, tag: TagHash) -> ProgramResult {
        instructions::gm::handler(ctx, tag)
    }
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct TagHash {
    pub value: [u8; 8],
}

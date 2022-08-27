// TODO: make this a function that takes the token name and symbol as params
export const initialTypes = (name = '', symbol = '') =>
`:: ${name} - ${symbol}
::
|%
++  sur
  |%
  ::
  ::  types that populate grains this standard generates
  ::
  +$  token-metadata
    $:  name=@t                 ::  the name of a token (not unique!)
        symbol=@t               ::  abbreviation (also not unique)
        decimals=@ud            ::  granularity (maximum defined by implementation)
        supply=@ud              ::  total amount of token in existence
        cap=(unit @ud)          ::  supply cap (~ if no cap)
        mintable=?              ::  whether or not more can be minted
        minters=(pset address)  ::  pubkeys permitted to mint, if any
        deployer=address        ::  pubkey which first deployed token
        salt=@
    ==
  ::
  +$  account
    $:  balance=@ud                    ::  the amount of tokens someone has
        allowances=(pmap address @ud)  ::  a map of pubkeys they've permitted to spend their tokens and how much
        metadata=id                    ::  address of the rice holding this token's metadata
        nonce=@ud                      ::  necessary for gasless approves
    ==
  ::
  +$  approve
    $:  from=id       ::  pubkey giving
        to=address    ::  pubkey permitted to take
        amount=@ud    ::  how many tokens the taker can take
        nonce=@ud     ::  current nonce of the giver
        deadline=@da  ::  how long this approve is valid
    ==
  ::
  ::  patterns of arguments supported by this contract
  ::  "action" in input must fit one of these molds
  ::
  +$  mint  [to=address account=(unit id) amount=@ud]  ::  helper type for mint
  +$  action
    $%  ::  token holder actions
        $:  %give
            to=address
            amount=@ud
            from-account=id
            to-account=(unit id)
        ==
    ::
        $:  %take
            to=address
            amount=@ud
            from-account=id
            to-account=(unit id)
        ==
    ::
        $:  %set-allowance
            who=address
            amount=@ud  ::  (to revoke, call with amount=0)
            account=id
        ==
    ::
        $:  %take-with-sig
            to=address
            account=(unit id)
            from-account=id
            amount=@ud
            nonce=@ud
            deadline=@da
            =sig
        ==
    ::  token management actions
        $:  %mint  ::  can only be called by minters, can't mint above cap
            token=id
            mints=(list [to=address amount=@ud account=(unit id)])
        ==
    ::
        $:  %deploy
            name=@t
            symbol=@t
            salt=@
            cap=(unit @ud)          ::  if ~, no cap (fr fr)
            minters=(pset address)  ::  if ~, mintable becomes %.n, otherwise %.y
            initial-distribution=(list [to=address amount=@ud])
    ==  ==
  --
::
++  lib
  |%
  ++  mintable
    |=  meta=token-metadata:sur
    ^-  ?
    ?:  ?=(^ cap.meta)
      (lth supply.meta u.cap.meta)
    %.n
  --
--
`

// TODO: make this a function that takes the token name and symbol as params
export const initialMain = (name = '', symbol = '') =>
`::  fungible.hoon [UQ| DAO]
::  ${name} - ${symbol}
::
::  Fungible token implementation. Any new token that wishes to use this
::  format can be issued through this contract. The contract uses an account
::  model, where each pubkey holds one rice that contains their balance and
::  alllowances. (Allowances permit a certain pubkey to spend tokens on your
::  behalf.) When issuing a new token, you can either designate a pubkey or
::  pubkeys who is permitted to mint, or set a permanent supply, all of which
::  must be distributed at first issuance.
::
::  Each newly issued token also issues a single rice which stores metadata
::  about the token, which this contract both holds and is lord of, and must
::  be included in any transactions involving that token.
::
::  Many tokens that perform various utilities will want to retain control
::  over minting, burning, and sending. They can of course write their own
::  contract to custom-handle all of these scenarios, or write a manager
::  which performs custom logic but calls back to this contract for the
::  base token actions. Any token that maintains the same metadata and account
::  format, even if using a different contract (such as zigs) should be
::  composable among tools designed to this standard.
::
::  Tokens that wish to be properly displayed and handled with no additional
::  work in the wallet agent should implement the same structure for their
::  rice.
::
/=  fungible  /lib/types
=,  fungible
|_  =cart
++  write
  |=  act=action:sur
  ^-  chick
  ?-    -.act
      %give
    =+  (need (scry from-account.act))
    =/  giver  (husk account:sur - \`me.cart \`id.from.cart)
    ::  this will fail if amount > balance, as desired
    =.  balance.data.giver  (sub balance.data.giver amount.act)
    ?:  ?=(~ to-account.act)
      ::  if receiver doesn't have an account, try to produce one for them
      =/  =id  (fry-rice me.cart to.act town-id.cart salt.giver)
      =+  [amount.act ~ metadata.data.giver 0]
      =+  receiver=[salt.giver %account - id me.cart to.act town-id.cart]
      (result [%&^giver ~] [%&^receiver ~] ~ ~)
    ::  otherwise, add amount given to the existing account for that address
    =+  (need (scry u.to-account.act))
    ::  assert that account is held by the address we're sending to
    =/  receiver  (husk account:sur - \`me.cart \`to.act)
    ::  assert that token accounts are of the same token
    ::  (since this contract can deploy and thus manage multiple tokens)
    ?>  =(metadata.data.receiver metadata.data.giver)
    =.  balance.data.receiver  (add balance.data.receiver amount.act)
    ::  return the result: two changed grains
    (result [%&^giver %&^receiver ~] ~ ~ ~)
  ::
      %take
    =+  (need (scry from-account.act))
    =/  giver  (husk account:sur - \`me.cart ~)
    ::  this will fail if amount > balance or allowance is exceeded, as desired
    =:  balance.data.giver  (sub balance.data.giver amount.act)
    ::
          allowances.data.giver
        %+  ~(jab py allowances.data.giver)
          id.from.cart
        |=(old=@ud (sub old amount.act))
    ==
    ?~  to-account.act
      ::  if receiver doesn't have an account, try to produce one for them
      =/  =id  (fry-rice me.cart to.act town-id.cart salt.giver)
      =+  [amount.act ~ metadata.data.giver 0]
      =+  receiver=[salt.giver %account - id me.cart to.act town-id.cart]
      (result [%&^giver ~] [%&^receiver ~] ~ ~)
    ::  otherwise, add amount given to the existing account for that address
    =+  (need (scry u.to-account.act))
    ::  assert that account is held by the address we're sending to
    =/  receiver  (husk account:sur - \`me.cart \`to.act)
    ::  assert that token accounts are of the same token
    ::  (since this contract can deploy and thus manage multiple tokens)
    ?>  =(metadata.data.receiver metadata.data.giver)
    =.  balance.data.receiver  (add balance.data.receiver amount.act)
    ::  return the result: two changed grains
    (result [%&^giver %&^receiver ~] ~ ~ ~)
  ::
      %take-with-sig
    ::  %take-with-sig allows for gasless approvals for transferring tokens
    ::  the giver must sign the from-account id and the typed +$approve struct above
    ::  and the taker will pass in the signature to take the tokens
    =/  giv=grain          (need (scry from-account.act))
    ?>  ?=(%& -.giv)
    =/  giver=account:sur  data:(husk account:sur giv \`me.cart ~)
    ::  reconstruct the typed message and hash
    =/  =typed-message
      :-  (fry-rice me.cart holder.p.giv town-id.cart salt.p.giv)
      (sham [holder.p.giv to.act amount.act nonce.act deadline.act])
    =/  signed-hash  (sham typed-message)
    ::  recover the address from the message and signature
    =/  recovered-address
      %-  address-from-pub
      %-  serialize-point:secp256k1:secp:crypto
      (ecdsa-raw-recover:secp256k1:secp:crypto signed-hash sig.act)
    ::  assert the signature is valid
    ?>  =(recovered-address holder.p.giv)
    ?>  (lte batch.cart deadline.act)
    ?>  (gte balance.giver amount.act)
    ?~  account.act
    ::  create new rice for reciever and add it to state
      =+  (fry-rice to.act me.cart town-id.cart salt.p.giv)
      =/  new=grain
        [%& salt.p.giv %account [amount.act ~ metadata.giver 0] - me.cart to.act town-id.cart]
      ::  continuation call: %take to rice found in book
      =/  =action:sur  [%take-with-sig to.act \`id.p.new id.p.giv amount.act nonce.act deadline.act sig.act]
      %+  continuation
        [me.cart town-id.cart action]~
      (result [new ~] ~ ~ ~)
    ::  direct send
    =/  rec=grain  (need (scry u.account.act))
    =/  receiver   data:(husk account:sur rec \`me.cart \`to.act)
    ?>  ?=(%& -.rec)
    ?>  =(metadata.receiver metadata.giver)
    =:  data.p.rec  receiver(balance (add balance.receiver amount.act))
        data.p.giv
      %=  giver
        balance  (sub balance.giver amount.act)
        nonce  .+(nonce.giver)
      ==
    ==
    (result [giv rec ~] ~ ~ ~)
    ::
      %set-allowance
    ::  let some pubkey spend tokens on your behalf
    ::  note that you can arbitrarily allow as much spend as you want,
    ::  but spends will still be constrained by token balance
    ::  note: cannot set an allowance to ourselves
    ?>  !=(who.act id.from.cart)
    =+  (need (scry account.act))
    =/  account  (husk account:sur - \`me.cart \`id.from.cart)
    =.  allowances.data.account
      (~(put py allowances.data.account) who.act amount.act)
    (result [%& account]^~ ~ ~ ~)
  ::
      %mint
    =+  (need (scry token.act))
    =/  meta  (husk token-metadata:sur - \`me.cart \`me.cart)
    ::  first, check if token is mintable
    ?>  mintable.data.meta
    ::  check if caller is permitted to mint
    ?>  (~(has pn minters.data.meta) id.from.cart)
    ::  loop through mints and either modify existing account or make new
    ::  note: entire mint will fail if any accounts are not found, or
    ::  if new accounts overlap with existing ones
    =|  issued=(list grain)
    =|  changed=(list grain)
    |-
    ?~  mints.act
      ::  finished minting
      (result [[%&^meta changed] issued ~ ~])
    =*  m  i.mints.act
    =/  new-supply  (add supply.data.meta amount.m)
    ?>  ?~  cap.data.meta  %.y
        (gte u.cap.data.meta new-supply)
    ?~  account.m
      ::  create new account for receiver
      =/  =id  (fry-rice me.cart to.m town-id.cart salt.data.meta)
      =+  [amount.m ~ token.act 0]
      =+  receiver=[salt.data.meta %account - id me.cart to.m town-id.cart]
      %=  $
        mints.act         t.mints.act
        supply.data.meta  new-supply
        issued            [%&^receiver issued]
      ==
    ::  find and modify existing receiver account
    =+  (need (scry u.account.m))
    =/  receiver  (husk account:sur - \`me.cart \`to.m)
    =.  balance.data.receiver  (add balance.data.receiver amount.m)
    %=  $
      mints.act         t.mints.act
      supply.data.meta  new-supply
      changed           [%&^receiver changed]
    ==
  ::
      %deploy
    !!
  ==
::
++  read
  |_  =path
  ++  json
    ^-  ^json
    ?+    path  !!
        [%mintable @ ~]
      =/  g=grain  (need (scry (slav %ux i.t.path)))
      ?>  =(lord.p.g me.cart)
      =/  meta  ;;(token-metadata:sur g)
      b+(mintable:lib meta)
    ==
  ::
  ++  noun
    ~
  --
--
`

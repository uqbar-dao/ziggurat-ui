export const initialTests =
`::  Tests for fungible.hoon (token contract)
::  to test, make sure to add library import at top of contract
::  (remove again before compiling for deployment)
::
/+  *test, cont=zig-contracts-zigs, *zig-sys-smart
=>  ::  test data
    |%
    ++  batch-num  1
    ++  town-id    0x123
    ++  salt       \`@\`'zigs'
    ::
    ++  holder-1  0xbeef
    ++  holder-2  0xdead
    ++  holder-3  0xcafe
    ++  holder-4  0xface
    ::
    ++  metadata-grain  ^-  grain
      :*  %&  salt  %metadata
          :*  name='Zigs: UQ| Tokens'  ::  change, lol
              symbol='ZIG'  ::  ??
              decimals=18
              supply=1.000.000
              cap=~
              mintable=%.n
              minters=~
              deployer=0x0
              salt=salt
          ==
          zigs-wheat-id
          zigs-wheat-id
          zigs-wheat-id
          town-id
      ==
    ::
    ++  account-1  ^-  grain
      :*  %&  salt  %account
          [50 (malt ~[[holder-2 1.000]]) zigs-wheat-id]
          0x1.beef
          zigs-wheat-id
          holder-1
          town-id
      ==
    ::
    ++  account-2  ^-  grain
      :*  %&  salt  %account
          [30 (malt ~[[holder-1 10]]) zigs-wheat-id]
          0x1.dead
          zigs-wheat-id
          holder-2
          town-id
      ==
    ::
    ++  account-3  ^-  grain
      :*  %&  salt  %account
          [20 (malt ~[[holder-1 10] [holder-2 20]]) zigs-wheat-id]
          0x1.cafe
          zigs-wheat-id
          holder-3
          town-id
      ==
    ::
    ++  account-4  ^-  grain
      :*  %&  \`@\`'diff'  %account
          [20 (malt ~[[holder-1 10]]) \`@ux\`'different!']
          0x1.face
          \`@ux\`'fungible'
          holder-4
          town-id
      ==
    --
::  testing arms
|%
++  test-matches-type  ^-  tang
  =/  valid  (mule |.(;;(contract cont)))
  (expect-eq !>(%.y) !>(-.valid))
::
::  tests for %give
::
++  test-give-known-receiver  ^-  tang
  =/  =yolk   [%give 10 holder-2 30 [%grain id.p:account-1] \`[%grain id.p:account-2]]
  =/  grains  (malt ~[[id.p:account-1 account-1] [id.p:account-2 account-2]])
  =/  =cart   [zigs-wheat-id [holder-1 1] batch-num town-id grains]
  =/  updated-1=grain
    :*  %&  salt  %account
        [20 (malt ~[[holder-2 1.000]]) zigs-wheat-id]
        0x1.beef
        zigs-wheat-id
        holder-1
        town-id
    ==
  =/  updated-2=grain
    :*  %&  salt  %account
        [60 (malt ~[[holder-1 10]]) zigs-wheat-id]
        0x1.dead
        zigs-wheat-id
        holder-2
        town-id
    ==
  =/  res=chick
    (~(write cont cart) ;;(action:sur:cont yolk))
  =/  correct=chick
    (result ~[updated-1 updated-2] ~ ~ ~)
  (expect-eq !>(correct) !>(res))
::
++  test-give-unknown-receiver  ^-  tang
  =/  =yolk   [%give 10 0xffff 30 [%grain id.p:account-1] ~]
  =/  grains  (malt ~[[id.p:account-1 account-1]])
  =/  =cart   [zigs-wheat-id [holder-1 1] batch-num town-id grains]
  =/  new-id  (fry-rice zigs-wheat-id 0xffff town-id salt)
  =/  new=grain
    :*  %&  salt  %account
        [0 ~ zigs-wheat-id]
        new-id
        zigs-wheat-id
        0xffff
        town-id
    ==
  =/  res=chick
    (~(write cont cart) ;;(action:sur:cont yolk))
  =/  correct=chick
    %+  continuation
      ~[[me.cart town-id.cart [%give 0xffff 30 [%grain id.p:account-1] \`[%grain new-id]]]]
    (result ~ [new ~] ~ ~)
  (expect-eq !>(correct) !>(res))
::
++  test-give-not-enough  ^-  tang
  =/  =yolk   [%give 10 holder-2 51 [%grain id.p:account-1] \`[%grain id.p:account-2]]
  =/  grains  (malt ~[[id.p:account-1 account-1] [id.p:account-2 account-2]])
  =/  =cart   [zigs-wheat-id [holder-1 1] batch-num town-id grains]
  =/  res=(each * (list tank))
    (mule |.((~(write cont cart) ;;(action:sur:cont yolk))))
  (expect-eq !>(%.n) !>(-.res))
::
++  test-give-high-budget  ^-  tang
  =/  =yolk   [%give 31 holder-2 20 [%grain id.p:account-1] \`[%grain id.p:account-2]]
  =/  grains  (malt ~[[id.p:account-1 account-1] [id.p:account-2 account-2]])
  =/  =cart   [zigs-wheat-id [holder-1 1] batch-num town-id grains]
  =/  res=(each * (list tank))
    (mule |.((~(write cont cart) ;;(action:sur:cont yolk))))
  (expect-eq !>(%.n) !>(-.res))
::
++  test-give-exact-budget  ^-  tang
  =/  =yolk   [%give 30 holder-2 20 [%grain id.p:account-1] \`[%grain id.p:account-2]]
  =/  grains  (malt ~[[id.p:account-1 account-1] [id.p:account-2 account-2]])
  =/  =cart   [zigs-wheat-id [holder-1 1] batch-num town-id grains]
  =/  updated-1=grain
    :*  %&  salt  %account
        [30 (malt ~[[holder-2 1.000]]) zigs-wheat-id]
        0x1.beef
        zigs-wheat-id
        holder-1
        town-id
    ==
  =/  updated-2=grain
    :*  %&  salt  %account
        [50 (malt ~[[holder-1 10]]) zigs-wheat-id]
        0x1.dead
        zigs-wheat-id
        holder-2
        town-id
    ==
  =/  res=chick
    (~(write cont cart) ;;(action:sur:cont yolk))
  =/  correct=chick
    (result [updated-1 updated-2 ~] ~ ~ ~)
  (expect-eq !>(correct) !>(res))
::
++  test-give-metadata-mismatch  ^-  tang
  =/  =yolk   [%give 10 holder-4 10 [%grain id.p:account-1] \`[%grain id.p:account-4]]
  =/  grains  (malt ~[[id.p:account-1 account-1] [id.p:account-4 account-4]])
  =/  =cart   [zigs-wheat-id [holder-1 1] batch-num town-id grains]
  =/  res=(each * (list tank))
    (mule |.((~(write cont cart) ;;(action:sur:cont yolk))))
  (expect-eq !>(%.n) !>(-.res))
::
++  test-give-wrong-giver-grain  ^-  tang
  =/  =yolk   [%give 10 holder-3 10 [%grain id.p:account-2] \`[%grain id.p:account-3]]
  =/  grains  (malt ~[[id.p:account-2 account-2] [id.p:account-3 account-3]])
  =/  =cart   [zigs-wheat-id [holder-1 1] batch-num town-id grains]
  =/  res=(each * (list tank))
    (mule |.((~(write cont cart) ;;(action:sur:cont yolk))))
  (expect-eq !>(%.n) !>(-.res))
::
++  test-give-wrong-giver-grain-2  ^-  tang
  =/  =yolk   [%give 10 holder-3 10 [%grain id.p:metadata-grain] \`[%grain id.p:account-3]]
  =/  grains  (malt ~[[id.p:metadata-grain metadata-grain] [id.p:account-3 account-3]])
  =/  =cart   [zigs-wheat-id [holder-1 1] batch-num town-id grains]
  =/  res=(each * (list tank))
    (mule |.((~(write cont cart) ;;(action:sur:cont yolk))))
  (expect-eq !>(%.n) !>(-.res))
::
++  test-give-wrong-receiver-grain  ^-  tang
  =/  =yolk   [%give 10 holder-2 10 [%grain id.p:account-1] \`[%grain id.p:account-3]]
  =/  grains  (malt ~[[id.p:account-1 account-1] [id.p:account-3 account-3]])
  =/  =cart   [zigs-wheat-id [holder-1 1] batch-num town-id grains]
  =/  res=(each * (list tank))
    (mule |.((~(write cont cart) ;;(action:sur:cont yolk))))
  (expect-eq !>(%.n) !>(-.res))
::
::  tests for %take
::
++  test-take-simple
  =/  =yolk   [%take holder-1 10 [%grain id.p:account-2] \`[%grain id.p:account-1]]
  =/  grains  (malt ~[[id.p:account-1 account-1] [id.p:account-2 account-2]])
  =/  =cart   [zigs-wheat-id [holder-1 1] batch-num town-id grains]
  =/  updated-1=grain
    :*  %&  salt  %account
        [60 (malt ~[[holder-2 1.000]]) zigs-wheat-id]
        0x1.beef
        zigs-wheat-id
        holder-1
        town-id
    ==
  =/  updated-2=grain
    :*  %&  salt  %account
        [20 (malt ~[[holder-1 0]]) zigs-wheat-id]
        0x1.dead
        zigs-wheat-id
        holder-2
        town-id
    ==
  =/  res=chick
    (~(write cont cart) ;;(action:sur:cont yolk))
  =/  correct=chick
    (result [updated-1 updated-2 ~] ~ ~ ~)
  (expect-eq !>(correct) !>(res))
::
++  test-take-send-third
  =/  =yolk   [%take holder-3 10 [%grain id.p:account-2] \`[%grain id.p:account-3]]
  =/  grains  (malt ~[[id.p:account-3 account-3] [id.p:account-2 account-2]])
  =/  =cart   [zigs-wheat-id [holder-1 1] batch-num town-id grains]
  =/  updated-3=grain
    :*  %&  salt  %account
        [30 (malt ~[[holder-1 10] [holder-2 20]]) zigs-wheat-id]
        0x1.cafe
        zigs-wheat-id
        holder-3
        town-id
    ==
  =/  updated-2=grain
    :*  %&  salt  %account
        [20 (malt ~[[holder-1 0]]) zigs-wheat-id]
        0x1.dead
        zigs-wheat-id
        holder-2
        town-id
    ==
  =/  res=chick
    (~(write cont cart) ;;(action:sur:cont yolk))
  =/  correct=chick
    (result [updated-3 updated-2 ~] ~ ~ ~)
  (expect-eq !>(correct) !>(res))
::
++  test-take-send-mismatching-account
  =/  =yolk   [%take holder-1 10 [%grain id.p:account-2] \`[%grain id.p:account-3]]
  =/  grains  (malt ~[[id.p:account-3 account-3] [id.p:account-2 account-2]])
  =/  =cart   [zigs-wheat-id [holder-1 1] batch-num town-id grains]
  =/  res=(each * (list tank))
    (mule |.((~(write cont cart) ;;(action:sur:cont yolk))))
  (expect-eq !>(%.n) !>(-.res))
::
++  test-take-send-new-account
  =/  =yolk   [%take 0xffff 10 [%grain id.p:account-2] ~]
  =/  grains  (malt ~[[id.p:account-2 account-2]])
  =/  =cart   [zigs-wheat-id [holder-1 1] batch-num town-id grains]
  =/  new-id  (fry-rice zigs-wheat-id 0xffff town-id salt)
  =/  new=grain
    :*  %&  salt  %account
        [0 ~ zigs-wheat-id]
        new-id
        zigs-wheat-id
        0xffff
        town-id
    ==
  =/  updated-2=grain
    :*  %&  salt  %account
        [20 (malt ~[[holder-1 0]]) zigs-wheat-id]
        0x1.dead
        zigs-wheat-id
        holder-2
        town-id
    ==
  =/  res=chick
    (~(write cont cart) ;;(action:sur:cont yolk))
  =/  correct=chick
    %+  continuation
      ~[[me.cart town-id.cart [%take 0xffff 10 [%grain id.p:account-2] \`[%grain new-id]]]]
    (result ~ [new ~] ~ ~)
  (expect-eq !>(res) !>(correct))
::
++  test-take-over-allowance
  =/  =yolk   [%take holder-1 11 [%grain id.p:account-2] \`[%grain id.p:account-1]]
  =/  grains  (malt ~[[id.p:account-1 account-1] [id.p:account-2 account-2]])
  =/  =cart   [zigs-wheat-id [holder-1 1] batch-num town-id grains]
  =/  res=(each * (list tank))
    (mule |.((~(write cont cart) ;;(action:sur:cont yolk))))
  (expect-eq !>(%.n) !>(-.res))
::
++  test-take-over-balance
  =/  =yolk   [%take holder-2 60 [%grain id.p:account-1] \`[%grain id.p:account-2]]
  =/  grains  (malt ~[[id.p:account-1 account-1] [id.p:account-2 account-2]])
  =/  =cart   [zigs-wheat-id [holder-2 1] batch-num town-id grains]
  =/  res=(each * (list tank))
    (mule |.((~(write cont cart) ;;(action:sur:cont yolk))))
  (expect-eq !>(%.n) !>(-.res))
::
++  test-take-no-allowance
  =/  =yolk   [%take holder-2 60 [%grain id.p:account-1] \`[%grain id.p:account-2]]
  =/  grains  (malt ~[[id.p:account-1 account-1] [id.p:account-2 account-2]])
  =/  =cart   [zigs-wheat-id [holder-3 1] batch-num town-id grains]
  =/  res=(each * (list tank))
    (mule |.((~(write cont cart) ;;(action:sur:cont yolk))))
  (expect-eq !>(%.n) !>(-.res))
::
::  tests for %set-allowance
::
++  test-set-allowance-simple
  =/  =yolk   [%set-allowance holder-3 100 [%grain id.p:account-1]]
  =/  grains  (malt ~[[id.p:account-1 account-1]])
  =/  =cart   [zigs-wheat-id [holder-1 1] batch-num town-id grains]
  =/  updated-1=grain
    :*  %&  salt  %account
        [50 (malt ~[[holder-2 1.000] [holder-3 100]]) zigs-wheat-id]
        0x1.beef
        zigs-wheat-id
        holder-1
        town-id
    ==
  =/  res=chick
    (~(write cont cart) ;;(action:sur:cont yolk))
  =/  correct=chick
    (result [updated-1 ~] ~ ~ ~)
  (expect-eq !>(correct) !>(res))
::
++  test-set-allowance-again
  =/  =yolk   [%set-allowance holder-2 100 [%grain id.p:account-1]]
  =/  grains  (malt ~[[id.p:account-1 account-1]])
  =/  =cart   [zigs-wheat-id [holder-1 1] batch-num town-id grains]
  =/  updated-1=grain
    :*  %&  salt  %account
        [50 (malt ~[[holder-2 100]]) zigs-wheat-id]
        0x1.beef
        zigs-wheat-id
        holder-1
        town-id
    ==
  =/  res=chick
    (~(write cont cart) ;;(action:sur:cont yolk))
  =/  correct=chick
    (result [updated-1 ~] ~ ~ ~)
  (expect-eq !>(correct) !>(res))
::
++  test-set-allowance-zero
  =/  =yolk   [%set-allowance holder-2 0 [%grain id.p:account-1]]
  =/  grains  (malt ~[[id.p:account-1 account-1]])
  =/  =cart   [zigs-wheat-id [holder-1 1] batch-num town-id grains]
  =/  updated-1=grain
    :*  %&  salt  %account
        [50 (malt ~[[holder-2 0]]) zigs-wheat-id]
        0x1.beef
        zigs-wheat-id
        holder-1
        town-id
    ==
  =/  res=chick
    (~(write cont cart) ;;(action:sur:cont yolk))
  =/  correct=chick
    (result [updated-1 ~] ~ ~ ~)
  (expect-eq !>(correct) !>(res))
::
++  test-set-allowance-self
  =/  =yolk   [%set-allowance holder-1 100 [%grain id.p:account-1]]
  =/  grains  (malt ~[[id.p:account-1 account-1]])
  =/  =cart   [zigs-wheat-id [holder-1 1] batch-num town-id grains]
  =/  res=(each * (list tank))
    (mule |.((~(write cont cart) ;;(action:sur:cont yolk))))
  (expect-eq !>(%.n) !>(-.res))
--
`

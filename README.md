# p_tinyfsm
tiny finite-state-machine for Promise

small example

```
require('p_tinyfsm')({lgc:{S:()=>(console.log('S'),{STS:'OK'}),E:()=>(console.log('E'),{STS:'OK'})},fsm:`
S.OK=>E
E.OK=>S
`}).then(rst=>console.log(rst))
```

# ![](../../../../assets/24q3/tier/1.svg) [Metronome](https://www.acmicpc.net/problem/27389) 

A _Metronome_ is a mechanical device used by musicians for keeping time. It is a very clever device, based on a spring, an inverted pendulum, and an escapement gear. Milo is learning to play the glockenspiel, and has purchased a metronome to help him keep time. Milo has noticed that for every complete turn (one revolution) of the key, the metronome will give four ticks. Milo wants the metronome to stop at the end of each song that he tries to play.

For a given song, how many revolutions must he wind the key?

#### Input

The single line of input contains a single integer $n$ ($1 \le n \le 10^5$), which is the length of the song in ticks.

#### Output

Output a single real number, which is the number of revolutions Milo must turn the metronome's key so that it stops precisely at the end of the song. This number must be accurate to two decimal places.

#### Problem rank

1

#### Example input 1

```
16
```

#### Example output 1

```
4.0
```

#### Example input 2

```
99
```

#### Example output 2

```
24.75
```
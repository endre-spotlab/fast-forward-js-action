# Fast Forward javascript action

'Fast Forward pull reaquest base (target) branch reference to head (source)'

## How to modify

Change source code in src/
Compile ts to js ```tsc --build tsconfig.json````
Commit changes


## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

uses: actions/hello-world-javascript-action@v1
with:
  who-to-greet: 'Mona the Octocat'
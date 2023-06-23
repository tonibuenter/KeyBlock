# Flow of App

publicAddress?  --no --> /login
                --yes--> Menu/AppMenu



# Dev Corner


## Troubleshooting & Errors
`react-app-rewired build` produces built with the following error

```
caught TypeError: Cannot convert a BigInt value to a number
    at Math.pow (<anonymous>)

```

Solution

Update browser list in `package.json`:

```
"browserslist": {
    "production": [
      "chrome >= 67",
      "edge >= 79",
      "firefox >= 68",
      "opera >= 54",
      "safari >= 14"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }

```


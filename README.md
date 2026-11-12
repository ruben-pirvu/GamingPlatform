# GamingPlatform

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.7.

## Components

- `src/` contains the Angular frontend.
- `api/` contains the ASP.NET Core Web API, targeting .NET 10.
- `GamingPlatform.sln` is the Visual Studio solution for the API.

Open `GamingPlatform.sln` in Visual Studio to develop and run the API. The Angular frontend remains a separate Node.js project and can be run with `npm start`.

## Run the application

Start the API in one terminal:

```bash
dotnet run --project api/GamingPlatform.Api.csproj
```

Start the Angular frontend in another terminal:

```bash
npm start
```

Open `http://localhost:4200/`. During development, Angular proxies `/api/**` to the API at `http://localhost:5000`. Verify the API with `http://localhost:4200/api/health` or directly at `http://localhost:5000/api/health`.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

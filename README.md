# ERNI Hack&amp;Hike - Dust Measurement Network - Frontend (and its backend)

This is Angular 6 application with .NET Core 2.1 backend.

To run it you need to have [Node.js](https://nodejs.org) and [.NET Core](https://www.microsoft.com/net/download) installed on your computer. When you have those then:
 1. clone this repo
 1. change into your clone `cd <your-clone-folder>`
 1. install .NET Core backend dependencies `dotnet restore`
 1. change to angular app directory `cd Frontend/ClientApp`
 1. install Angular frontend dependencies `npm install`
 1. go back to Frontend `cd ..`
 1. launch the project by `dotnet run`
 1. navigate your browser to https://localhost:5001

The project is developed in [Visual Studio Code](https://code.visualstudio.com/) so if you use this IDE, you don't need to do all the steps above, you only need to install frontend Angular dependencies, VS Code will do the rest (VS Code project settings are already part of this repo). To launch it, just hit F5.

Few usefull VS Code extensions:
- C# by Microsoft (mandatory for running/debugging backend)
- Angular Language Service by Angular
- EditorConfig for VS Code by EditorConfig
- TSLint by egamma
- vscode-icons by Roberto Huertas

Remember that **whenever you pull new version, it's a good idea to reinstall backend and frontend dependencies**, as someone might have changed them.

**IMPORTANT**

Please **DON'T** commit connection strings/passwords/API keys etc. into repository, because its public. Preferrably use [ASP.NET Core Secret manager](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-2.1&tabs=windows#secret-manager) to store them locally. For example to set connection string to database (this solution uses PostgreSQL) use: `dotnet user-secrets set "ConnectionStrings:DustDatabase" "<your-connection-string>"`

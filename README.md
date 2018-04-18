# Zero Boilerplate Redux

A common criticism of Redux is that it requires writing a lot of boilerplate.
This is an application that is meant to show a sophisticated CRUD webapp built
with React that is built using nearly zero Redux boilerplate.

### Technologies used

* [Create React App](https://github.com/facebookincubator/create-react-app) for
  scaffolding
* [React Router](https://github.com/ReactTraining/react-router) for routing
* [Redux Resource](https://github.com/jmeas/redux-resource/) for managing
  resource data

### Prequisites

* Node v8+
* npm v5+

> Note: This project should also work on earlier versions of Node and npm. It just hasn't
> been tested.

### Installation

Make sure you have the prequisite technologies listed above. Then, clone this repository.

`git clone git@github.com:jmeas/zero-boilerplate-redux.git`

Navigate into the repository, and install the dependencies using [npm](https://www.npmjs.com/).

`npm install`

This project is a real CRUD application that operates on your GitHub Gists. Therefore,
you will need to supply credentials to access your GitHub Gists in the form of a
[GitHub Personal Access Token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/).

Follow those instructions, then create the file `./src/personal_access_token.json`. It should have the following
contents:

```json
{
  "username": "YOUR_GITHUB_USERNAME",
  "token": "YOUR_ACCESS_TOKEN"
}
```

For instance, mine looks something like the following:

```json
{
  "username": "jamesplease",
  "token": "12345"
}
```

Alright, that's it – you're ready to start the app now! Run `npm start` to start the application, then navigate to
`http://localhost:3000/` in your browser.

### Forms

If you're building a CRUD application, you likely need to work with a lot of
forms. For simplicity's sake, this project doesn't use a forms library.

Two forms libraries that are worth looking into are:

* [react-redux-form](https://davidkpiano.github.io/react-redux-form/docs.html)
* [redux-form](https://github.com/erikras/redux-form)

## Jace Whitten - React API Table 

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Notes
* Redux Sagas - while I did spend a little time reviewing the concept, because of my lack of knowledge of using generators, I did not employ it for this exercise. However, I would spend more time learning it for day to day usage.

* State manager - [Redux](https://github.com/reactjs/redux)

* Style efforts - I took a minimal approach to this. I did not use any css framework to keep it light and to the point. Design requires a lot of thought and choices that can be distracting to the task at hand.

* Using a table library - I chose to use the [React table](https://github.com/react-tools/react-table) package to do all my heavy lifting. I spent a little time reviewing the most rebust, least amount of friction, well supported library.


## Folder Structure

After creation, your project should look like this:

```
my-app/
  README.md
  node_modules/
  package.json
  public/
    index.html
    favicon.ico
    manifest.json
  src/
    actions/
      index.js
    components/
      Picker.js
    containers/
      App.js
    reducers/
      index.js
    index.js
    createServiceWorker.js
```

For the project to build, **these files must exist with exact filenames**:

## Available Scripts

In the project directory, you can run:

### `npm or yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build or yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!


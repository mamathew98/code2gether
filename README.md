# CODE2GETHER

Code2Gether is a Platform Designed for developing web components 
that you can code in HTML/CSS/JAVASCRIPT in collaboration with friends or collegues
and see the result in real-time and even chat with each other while working on a project. All in One Platform ! 

![Alt text](/screenshots/Shot1.jpg?raw=true "Home Page") ![Alt text](/screenshots/Shot3.jpg?raw=true "Editor Page")


## Requirements

Main Requirements used in this project are mentioned below: 

- Nodejs
- Express
- MongoDB
- Socket.io
- OTjs
- PeerJs

## Installation

1) First make sure u have nodejs and (node package manager) and MongoDB installed on your system,
if you don't you can get them from links below: 

- Nodejs
> https://nodejs.org/en/download/
- MongoDB
> https://www.mongodb.com/try/download/community

2) Clone or Download this Repository:

```
git clone https://github.com/mamathew98/code2gether.git
```

3) Go in root directory of the project and run `npm install` and wait for the dependecies to get installed: 

```
cd code2gether
npm install
```

4) Make sure Your 3000 port on device is available and run: 

```
npm start
```

5) Go to `/PeerServer` and run `npm install` and wait for dependecies to get installed

```
cd /PeerServer
npm install
```

6) Make sure Your 9000 port on device is available and run `npm install` in `/PeerServer` directoy 

```
npm start
```

7) For Running on Your Local Server head to `/public/javascripts/editor.js` File and Comment the section below `//FOR SERVER DEPLOYMENT` and Uncomment the section below `// FOR LOCAL DEPLOYMENT`

![Alt text](/screenshots/Shot3.jpg?raw=true "Editor Config")

8) Open a Browser and go to `http://localhost:3000/`

9) Vola! Now you can register and make a project and share its link with others so you can collaborate on the project together



## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](./License.md)

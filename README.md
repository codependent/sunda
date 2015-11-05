# sunda
REST Service Mock application powered by 

* Node.js
* AngularJS
* express
* jade
* nfconf
* q
* winston
* ..and many others.

It is intented to be used as a mock for REST services. You just configure the operations and resources needed, and the different responses expected. Your client app attacks this service instead using http://localhost:3000 + the desired configured path and voila!

## Path definitions

Paths support Express' URL sintax:
* **Path variables**: /users/:userId -> Would answer to urls such as `http://localhost:3000/users/1` `http://localhost:3000/users/4`
* **URL Variables**: they have to be defined using the URL Params button.

## Launch Sunda!
To use it just execute `npm install` followed by `npm start`.

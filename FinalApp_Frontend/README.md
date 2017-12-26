# Ricebook

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## API Desogn Decision
I decided to use user name as the identifier for searching articles, comments and profiles. I decided to prevent user to use repeated username at the registeration phrase to make the username a valid unique identifier.


## Registered user:
Below are the information of some registered user:
username  password
ry13      yrq
fl23      fl23
wl49      wl49
wl49test  wl49test
zl52      zl52
qz25      qz25
zl52test  zl52test
Follower  try

These user could used to test my app by either login one of them or adding them as followers.

## Third-Party Authentication
I used Facebook oauth in my app. I design the link/unlink process as:
Only the user login by third-party oauth can link to a user who is registered by normal password.
Similarly, only the user who is registered by normal password can use the unlink button to unlink from a third-party oauth user. After link process, all articles, comments and followers will belong to the linked user. Then, user should login to the normal registered account to check update. However, after unlink, I only delete the auth field for the normal reigstered user.



Please check my backend code on heroku git repo, I've invite all TAs to my git repo. 


## COMP 531 peer review

1. http://socialweb.surge.sh
I like the cartoon style of this front end. 
However, I believe you could make more use of some libraries like mat-card or Bootstrap to decorate your website more.
On the profile page, I believe a button to back to main page would be better to use.
Another recommendation would be to make your textfiled for post new article larger.

Overall user experience: 7/10

2. http://loving-fiction.surge.sh 
I really like the concise style on your login and register page. And the images you picked for sample users
However, I think you could improve your format on your main page.
Moveover, I found that your search bar didn't work quite well.

Overall user experience: 7/10

3. http://medical-insect.surge.sh/#/
I like the responsive your login and register pages.
The overall layout and style of the main is also concise and refreshed. I enjoyed it.
However, I found that the username and password your provided cannot login. I registered one for myself. I found that there is no default avatar for the profile I created. I believe it's better for everyone has some avatar at the beginning.

Overall user experience: 8.5/10

4. http://talkaware.surge.sh
I like the design of the login and register pages. The prompt out information for successfully login is also very creative and impressive.
However, I would recommend that you could enlarge the size of the images in articles.

Overall user experience: 8/10

5. https://shappyMedia.surge.sh
Unfortunately, after I login to the account I registered for myself, I got lots of 401 errors, I suppose that you used this domain for final app. Except register and login, I cannot do anything else, sorry.

Overall user experience: 2/10


# Email Demo 

1. Showcase Email Sending using Google Account via App Password
1. Both Front End and Back End are present
1. Project [Frontend](Frontend) is Angular 19 version. 
1. Project [FrontEndAngular16](FrontEndAngular16) is Angular 16 version. 

# Special Thanks

Code inspired by https://github.com/Sandeepmopidevi/Email-SMTP-Module via [Sandeepmopidevi](https://github.com/Sandeepmopidevi)

# Points to Remember

Important Notes About Creating a "Developer" Google Account

1. For this, need to create a google account. 
1. DONT Use Your own personal account. Create a seperate account for developer purposes.
1. Google will 'block' your developer account because you already have google account for your android phone.
1. Make sure you put date of birth as at least 18 years.
1. Make sure to put a recovery phone number to get SMS (for activating your google account)
1. Make sure to put your original google account, used on your android phone, for activation purposes, as the recovery account
1. After making sure, everything is good, try sending an email to your original google account and also reply.
1. This entire process can take some time. So, as always, please be patient. 

Next, Sign in with app passwords

1. You need user name and password to make the Email Server work. 
1. For this purpose you have to create a 'app password'
1. To do this, go to "Manage My Account" and activate "2 Factor Authentication" using the search box
1. Then, again, go to 'Manage My Account" and activate "app passwords" using the search box
1. Give a name, like, 'Developer Testing" and a password will be generating and given to you.
1. Use this "app password" along with your email address in the code

Expect Error Number One

```
An error occurred while sending the email: 534: 5.7.9 Please log in with your web browser and then try again. For more
5.7.9 information, go to
5.7.9  https://support.google.com/mail/?p=WebLoginRequired d9443c01a7336-22c50ed0f90sm41419435ad.185 - gsmtp
```

If you get this, try changing 'SmtpPort = 587' to 'SmtpPort = 465'

Expect Error Number Two

```
SMTP protocol error: The SMTP server has unexpectedly disconnected.
```

If you get this error, there is nothing you can do. Google has become very strict with their email services. Your next option is to use a email service like SendGrid or MailChimp which is out of syllabus for our current project. 

# book a session with me

1. [calendly](https://calendly.com/jaycodingtutor/30min)

# hire and get to know me

find ways to hire me, follow me and stay in touch with me.

1. [github](https://github.com/Jay-study-nildana)
1. [personal site](https://thechalakas.com)
1. [upwork](https://www.upwork.com/fl/vijayasimhabr)
1. [fiverr](https://www.fiverr.com/jay_codeguy)
1. [codementor](https://www.codementor.io/@vijayasimhabr)
1. [stackoverflow](https://stackoverflow.com/users/5338888/jay)
1. [Jay's Coding Channel on YouTube](https://www.youtube.com/channel/UCJJVulg4J7POMdX0veuacXw/)
1. [medium blog](https://medium.com/@vijayasimhabr)
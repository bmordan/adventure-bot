> topic name
  + ok lets go
  - Please tell me your name.

    + *~2
    % please tell me your name
    - Nice to meet you <cap1>.
    ^ ^save("name",<cap1>)
    ^ ^topicRedirect("email","__email__")

  + maybe later
  - thats a shame {topic=main}
< topic

> topic email
  + __email__
  - I will also need your email address

    + *~2
    % i will also need your email address
    - Thank you ^get("name"). ^parseEmail(<cap>)
    ^ ^topicRedirect("project","__project__")
< topic

> topic project
  + __project__
  - Now please tell me all about your project

   + *~1000
   % now please tell me all about your project
   - {@__reaction__} What is your project's title?
   ^ ^save("brief",<cap>)

  + __reaction__
  - Wow! sounds really interesting.
  - Amazing, sounds cool.
  - Thats quite something!

  + *~5
  - <cap> nice. What kind of budget do you have?
  ^ ^save("title",<cap>)
  ^ ^addMessageProp("buttons",["£5k - £10k", "£10k - £50k", "£50k - £100k", "not fixed"])

  + 5k * 10k
  - Fair enough. {@__designs__}
  ^ ^save("budget","£5k - £10k")

  + 10k * 50k
  - Sounds good. {@__designs__}
  ^ ^save("budget","£10k - £50k")

  + 50k * 100k
  - Alright! {@__designs__}
  ^ ^save("budget","£50k - £100k")

  + not fixed
  - That's ok. It helps us to have an idea of your budget. Development can get really expensive. {@__designs__}
  ^ ^save("budget","not fixed")

  + __designs__
  - Have you designs or wireframes for your project?
  ^ ^addMessageProp("buttons",["yes","no"])

  + yes
  - Ace. We'll ask for these later. Don't worry we have a 'non-disclosure agreement' we can both sign. {@__open_source__}
  ^ ^save("designs","true")

  + no
  - Ok we can help with designs. {@__open_source__}
  ^ ^save("designs","false")

  + __open_source__
  - Would you be happy for your codebase to be published as open source software?
  ^ ^addMessageProp("buttons",["I would","Not this time","Tell me more"])

  + i would
  - Excellent. We love to share. ^save("open","false") ^topicRedirect("completed","__completed__")

  + not this time
  - Proprietary project. Noted. ^save("open","false") ^topicRedirect("completed","__completed__")
  - Then we will privately host your codebase. ^save("open","false") ^topicRedirect("completed","__completed__")

  + tell me more
  - The term "open source" refers to something people can modify and share because its design is publicly accessible. Would you like your project to be open source?
  ^ ^addMessageProp("buttons",["I would","Not this time"])
< topic

> topic completed
  + __completed__
  - Thanks ^get("name").
  ^ ^sendEnquiry()
< topic

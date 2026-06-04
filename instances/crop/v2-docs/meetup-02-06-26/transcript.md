Jun 2, 2026
Meeting Jun 2, 2026 at 20:28 GMT+07:00 - Transcript
00:00:00
 
Oleh Pedchenko: Let's go
Vova Pirotskiy: Hello.
Oleh Pedchenko: for
Vova Pirotskiy: Don't touch it.
Denis Baranov: I'm sorry.
Vova Pirotskiy: Okay.
Oleh Pedchenko: Yep. Mhm.
Vova Pirotskiy: Okay. Oh, it's cuz I was just criminal. Not the budget.
Oleh Pedchenko: Yeah, they don't dream about this for stuff.
Vova Pirotskiy: this
John Stechyshyn: Oh, is everybody here already? Oh my god, I can't even believe it.
Denis Baranov: Oh,
Vova Pirotskiy: Yeah.
John Stechyshyn: Everybody sleeping or what? You got your AI assistants on the call?
Denis Baranov: no.
Vova Pirotskiy: We just was here. Um
John Stechyshyn: What are we going to
Vova Pirotskiy: so yeah so
John Stechyshyn: guys?
Vova Pirotskiy: maybe you can uh drive uh so you wanted to talk about
Oleh Pedchenko: Hello.
Vova Pirotskiy: the version two.
John Stechyshyn: Yeah,
Vova Pirotskiy: Yeah.
John Stechyshyn: why don't you drive VVA and show where uh the development environment is right now with the new parts diagrams and let's talk about also
Vova Pirotskiy: Oops.
John Stechyshyn: what the current production environment is and let's try to kind of outline what two weeks looks like for version two and We also need to loosely talk about kind of roles and responsibilities I think as we move further ahead.
 
 
00:16:13
 
John Stechyshyn: Not that we have to have them concrete but I think we have some idea what we believe to be true. By the way, all of this is up for debate, but I think I'll start with the roles and responsibilities. And my belief is that just because of Ola's familiarity with the tech stack that he's going to be the primary kind of user experience and uh front-end development in terms of what do I want? What am I saying? I am saying that I would like him to use his a little bit of freedom to express his opinion about the quality of the navigation and the functionality and any potential bugs and how we search and so on and so forth for the user both desktop and mobile. That's that is what I think would be Ola's primary role. Again, up for debate. It's not locked in stone. That's my gut feeling. Secondarily from Dennis's perspective, I think I can use him in a lot of different areas. But while I'm on this front end thing, I he's expressed, you know, experience with user experience and with navigation also.
 
 
00:17:34
 
John Stechyshyn: And I would like somehow for you guys, first of all, the green team is a team. You guys need to be talking with it with your success is all hinged on each other's success. It's that simple. So, you need to bring each other along and try to figure this out together. You need to add value. You need to find out. This is a very, very young platform. And I'm looking for leadership, not ideas without work. I'm looking for leadership also. Some qualities of that. So, Dennis, what I'm asking of you is like an advisory, right? Right. I want a level set on the user experience with Ola.
Oleh Pedchenko: Awesome.
John Stechyshyn: Uh this is not oversight. This is a second pair of eyes is all for Ola's sake. Right? Like something maybe he doesn't see. Maybe you can suggest if you see something, right? So, Ola, I just look at that. This is not a parenting thing.
 
 
00:18:35
 
John Stechyshyn: This is a uh second set of eyes. That's what I want you to have. I just don't want I I had gone I've gone into big companies. I'll tell you why this is. I have never done any layer 4 firewall work in my entire life. And I was hired onto IBM with 600,000 employees. And I was told that I was responsible for the front door layer 4 gateway uh to all of our microservices applications and I had to design this and I had never designed or really had any background in this. Okay. So I say that because I know it's very easy to like be in the middle of something and you're like how can I be the expert on this? I've not done this before. And um so I'm offering you from my experience just a second set of eyes. Someone that can to bounce ideas off and say does this seem right to you? You can do that from Danel. You can do that from VVA.
 
 
00:19:32
 
John Stechyshyn: But I just want to make sure that Dennis you have expressed interest. I'm just following up with that. And also Dennis may be doing the QA. So I think it may be beneficial if he gots has his fingers a little bit in what the testing will be in production. So we can then test against our development environments in the same way the same set of tests. I want to make sure that when we move our version two into production that we are to the degree possible bug free right um Ola I know you expressed that you saw buggginess in the front end agreed. So I'm hoping that you have uh ability to you know satisfy some of that.
Oleh Pedchenko: Yeah.
John Stechyshyn: Any questions so far?
Oleh Pedchenko: No, no, absolutely. It just makes sense for me. We should mirror the production test scenarios in development as closely as possible.
John Stechyshyn: Okay.
Oleh Pedchenko: So, yeah, version two is uh validate against the same conditions and we can catch issues uh before release. So yeah.
 
 
00:20:35
 
John Stechyshyn: What about you,
Oleh Pedchenko: Uh yeah.
John Stechyshyn: Dennis? Uh, Dennis, what about you? Just sorry, asking Dennis's thought. You following Dennis?
Oleh Pedchenko: What?
Denis Baranov: It's good way uh for retract and second vision of the some things implemented u but uh now I working on some the clock too too much uh small bugs or too
John Stechyshyn: No. Yeah. So,
Denis Baranov: much can be
John Stechyshyn: let me let me say this. Let me let me interrupt. I'm okay with backlog, but VVA and I were speaking about backlog a little bit and we believe that there is so much that it's our hope that we fix a lot of this in version two. Right. So there's been so many layer va maybe you should speak to this a little bit and maybe you can speak in Ukrainian to explain what you might
Oleh Pedchenko: It's
John Stechyshyn: how we might transition what we're doing now to be more efficient.
Oleh Pedchenko: simple.
John Stechyshyn: Can you do that while I just think it would be
 
 
00:21:43
 
Vova Pirotskiy: Okay.
John Stechyshyn: betterian
Vova Pirotskiy: Uh, front end. pipeline production.
Oleh Pedchenko: Mhm.
Vova Pirotskiy: for production.
Oleh Pedchenko: Oh, miss.
Vova Pirotskiy: Mhm. Agree.
Oleh Pedchenko: To be honest, Improvements experience
Vova Pirotskiy: But I'm really
Oleh Pedchenko: You can hear yourself.
Vova Pirotskiy: Okay. Mhm.
Oleh Pedchenko: Second
Denis Baranov: features.
Vova Pirotskiy: I'm
Denis Baranov: Yeah. It's no implement.
Vova Pirotskiy: issues. foreign the uh what she was. Mhm. house. Front
Oleh Pedchenko: Oh,
Vova Pirotskiy: for.
Oleh Pedchenko: no.
Vova Pirotskiy: Mhm.
Denis Baranov: Foreign
Oleh Pedchenko: Yeah,
Vova Pirotskiy: Mhm.
Oleh Pedchenko: review.
Vova Pirotskiy: Not the cross review.
Denis Baranov: speech. Foreign speech.
Vova Pirotskiy: Mhm.
Oleh Pedchenko: Yeah.
Vova Pirotskiy: Mhm.
Denis Baranov: Fore!
Vova Pirotskiy: Mhm.
Denis Baranov: Foreign! Foreign!
Vova Pirotskiy: Mhm. Uh guys making nice proposal to also make Denise check and test the PRS because he can run them locally and he can also test and uh check.
Oleh Pedchenko: Don't put
Denis Baranov: I'm
Vova Pirotskiy: John, are you here?
 
 
00:29:08
 
Oleh Pedchenko: this
Denis Baranov: done.
Vova Pirotskiy: Okay, you're waking up. Mhm. Yeah. Uh the guys making nice proposal also to make a QR for the PRs because Dennis can run them locally and uh uh see something and propose something immediately like you like you said second pair of
John: I like that. I like it. I like it. I like it. Yeah,
Vova Pirotskiy: eyes.
John: I like that. Let's do that.
Vova Pirotskiy: Mhm.
John: So, uh, next Friday we're going to deliver um to the Ola.
Oleh Pedchenko: Yeah.
John: Go ahead.
Oleh Pedchenko: Yeah.
Vova Pirotskiy: Yeah,
Oleh Pedchenko: Yeah. You can talk.
John: No, you're good. Continue, please.
Oleh Pedchenko: Okay.
Vova Pirotskiy: cool.
Oleh Pedchenko: Yeah. Uh also uh we talked about that uh we maybe uh create some plan and uh we also propose that uh Denise can uh review my PRs. We we maybe make sure that we already have a plan how to test it, how to implement it. After that uh when Denise already check my PRs uh we move it uh to VA and after that VA checks uh already uh completed PS with uh good implementation with good uh I don't know maybe uh user user friendly interface and etc.
 
 
00:30:55
 
Denis Baranov: tier quot and other things.
Oleh Pedchenko: Yeah. Yeah.
Denis Baranov: Yeah. And uh for example, we can I don't know maybe I like work on some functional functionality things and I
John: Look, just do it. Look, just do it. My main concern is having having us really battle tested for production. So, what I'm Let me propose something back to you. Okay. Like I stated at the first part of this call, you and Ola, Dennis, and Dan, you're a team. I want you guys to produce good code, ready for production.
Denis Baranov: Okay.
John: You guys are all new and fresh, and you all need communication in the green team channel. Why? Because none of you know the product and the project yet all the way. Not like VVA and like uh Alex. So, I want you to use that time like, you know, growing some vegetables and fruit, right? I want you guys to mature into the project. So, um, communicate with one another, come up with a plan, hold each other accountable, let me know if there's a problem with that, okay?
 
 
00:32:07
 
John: If anybody's a weak link, I want to know. And I'm not saying to tattle and tail on anybody, but I'm just saying that you guys are going to be accountable to one another because I want to leave VVA and Alex alone. We have been doing this project now for nine, 10 months. These guys are making good progress and um they're my last gatekeepers. And what I envision while you're learning is to put you guys in lowrisk positions, low risk to the to the production so you can not just be dumped into all of this readiness, right? Um, I want I think it's fair for you guys to have more than three days uh to understand the project and the scope and the challenges that we face and all of the little things. And I think it'll make a lot of sense in the next coming weeks. Next week, I lost power, by the way. That's why I dropped off. Uh, I don't know what happened here. The whole building lost power. um over the next uh two weeks, next Friday, we're going to deliver version two to the degree that we can.
 
 
00:33:17
 
John: Okay? What you guys need to think about is what you can actually deliver. Okay? Not aspirational. I don't want two weeks and then turning into four weeks turning into six weeks. So, think about the work that we can do to make a really bulletproof. Right now, we're selling parts, okay? We want to make sure that the next phase, our next iteration, we sell more parts,
Oleh Pedchenko: Yep.
John: customers can see more brands, more uh more uh um more parts diagrams,
Vova Pirotskiy: more parts. More diagrams. Yes.
John: more parts diagrams, etc. Right?
Vova Pirotskiy: Yes.
John: and then any additional features that we can add the my garages and the things like that. I can tell you we're less ready for but it's great to make progress in that direction. We have our AI aspirations. We have lots of aspirations in the pipeline in our playbook. Step one is building a good team, high-erforming team that knows the domain that can help us make strong decisions about what to do next. That's where we are right now.
 
 
00:34:33
 
John: Does that I hope that makes sense for everybody.
Oleh Pedchenko: Yep.
John: But um so
Denis Baranov: Yes.
Oleh Pedchenko: Sounds great.
Vova Pirotskiy: Yes.
John: next Friday, next Friday I'm going to show this to ownership. VVA has Vulva, can you drive and show what you have so far for diagrams? I want you I want to see where want them to see where you are with the diagrams and then compare that to our production state and how we kind of have to get to that phase, right? how they uh the new the new the new brands have to make it to where we are today and we have to fill in some gaps show
Vova Pirotskiy: you uh you mean for the um design or for
John: crap show no show well you can show that too but let's start with
Vova Pirotskiy: the that's
John: I come back to this at the end but I want to I want to see prop
Vova Pirotskiy: Okay.
John: app dev you know our app dev environment And I want to see
Vova Pirotskiy: Mhm.
John: crop
Vova Pirotskiy: Or yes.
John: production.
 
 
00:35:39
 
Vova Pirotskiy: Um
John: Is this app? Is this uh let me see if I can log back in. Yeah.
Vova Pirotskiy: Um, so now I just uh add some more diagrams
John Stechyshyn: Is this Hold on.
Vova Pirotskiy: for another vendors.
John Stechyshyn: Is this Which one is this?
Vova Pirotskiy: This is New Poland.
John Stechyshyn: No, I know. Is this uh production or is this development?
Vova Pirotskiy: No, this is uh development.
John Stechyshyn: Okay, got it. All right. So, wanted to show production. So, this is New Holland.
Vova Pirotskiy: Um,
John Stechyshyn: So, this is what it looks like. It doesn't look like this today, though. It's not exactly what it looks like right now.
Vova Pirotskiy: so you want to
John Stechyshyn: Yeah. Let's just see production.
Vova Pirotskiy: production
John Stechyshyn: All right. So, you pick a tractor. You pick the Boomer 40, right? That's the model of tractor. By the way, let's step back once. I just for for Ola for you here's where my g my my first gaps are and we have a figma with all the brand pages.
 
 
00:37:03
 
John Stechyshyn: So I I want you to get some kind of a feel for how do we navigate right?
Oleh Pedchenko: Mhm.
John Stechyshyn: So the very first thing someone's going to pick is, you know, if it's a Mercedes or BMW, right? So the first thing they're going to fix pick is a brand, right? When they are searching for parts, probably get BMWs because I heard they don't get in
Vova Pirotskiy: H.
John Stechyshyn: accidents.
Vova Pirotskiy: Yeah.
John Stechyshyn: You I said they probably BMW because they don't get in accidents is what I hear. Only Mercedes Only Mercedes get in.
Vova Pirotskiy: Ah,
Oleh Pedchenko: But I said this, guys.
Vova Pirotskiy: now I get at this joke.
John Stechyshyn: Um,
Vova Pirotskiy: Uh, yeah. So, maybe we can start from here. Yeah.
John Stechyshyn: okay. So,
Vova Pirotskiy: Um,
John Stechyshyn: here is where when we go to shop for uh what what what landing page is this? Is this all brands or it's parts?
Vova Pirotskiy: yeah. This is all brands.
John Stechyshyn: Okay. So, this is the all brands page.
 
 
00:38:01
 
John Stechyshyn: Can you bring the Figma up, please?
Vova Pirotskiy: Mhm.
John Stechyshyn: And I want to show the play where Maria was making all the brand pages as an example. And they don't Can they share this for free? Can we share this with them for free? I can't remember if they have to be a paid
Vova Pirotskiy: Yes. Yes. Yes. Yes. Yes. No.
John Stechyshyn: user.
Vova Pirotskiy: That's public now.
John Stechyshyn: Okay. Um, so Maria we had as a designer and she made a awful lot of pages. Most of them are kind of they should be deprecated but they're not. But at least it gives you a visual of some of the ideas that were thrown around. There's quite a lot of them. If you could zoom in at the bottom uh I think it's the bottom center. No. Yeah, down there. Uh, no. No.
Oleh Pedchenko: VA can you provide this link to to us
Vova Pirotskiy: Yes,
Oleh Pedchenko: maybe in the chat I
 
 
00:39:03
 
Vova Pirotskiy: sure.
Oleh Pedchenko: think
John Stechyshyn: very very important when he provides this for us to just remember that it's ideas they are not plans right these are not concrete they were how do we do this so it it'll it'll it should give you some so here is a um a page that we we talking about having parts and the equipment types because if someone goes to New Holland right here, if you're on New Holland, well, you might want to shop part diagram by the by the type of equipment, but then below you might have the parts. So, we toyed with this idea of putting it all on one page. You have SEO, you have content, you have images of parts. It looks all fine and good. I don't know if this works. Um, scroll to the right. Zoom out. Here is a picture of when you pick on a tractor, right?
Vova Pirotskiy: Mhm.
John Stechyshyn: You picked a T9 tractor, a model, and they have actual pictures. Go back to production if you would VVA.
 
 
00:40:06
 
John Stechyshyn: And I want to show them if now if you select New Holland A right there. Scroll down. Now I take pick a tractor. Go to tractor. This is where the T9 should be. If I click on T9, scroll down. There's this is the s*** that I have. Okay. So you scroll up and you see all of the, you know, b******* that will mean nothing to anybody. And there Yeah. And there's T9 in there somewhere. Okay. See the T9 XXX. And that, by the way, a lot of this data, the reason it's so s***** is because it comes from a s***** source, right? So this is coming from Case New Holland's E parts because we we robbed all their data so we could build this site because there's all this b*******. All right. So let I'll save all that for you. We're working with a source of data that we have to work with and we're trying to make it our own and clean and clear and a and have the ability to update it constantly.
 
 
00:41:02
 
John Stechyshyn: So if you pick T9 and the T9 tractors to the right, no, pick the other one to the right of that. Unselect that one. Okay. Now, now if when you're looking right here, you see these T9s. Go back to the other image. Go uh go back to the Figma. Okay, you see these T? Those are T9's below. Scroll below down. Those are all T9s, right? So,
Oleh Pedchenko: Mhm.
John Stechyshyn: you see that there's just a content gap with images that would make it look nicer. Not critical, but sure would be nice for us to have the equipment type images ultimately exposed. It makes it look less like a dead page in my opinion. Ola, I will defer to you as the expert on this, but to me, to the naked eye, um, it's a little bit too much the same with just boxes with little hex tractors in them. Okay, go back to uh, scroll out on the Figma some more. Let's look at the next page.
 
 
00:42:04
 
John Stechyshyn: Figma,
Oleh Pedchenko: Yes, I see the gap.
John Stechyshyn: sorry.
Oleh Pedchenko: So functionality uh uh the flow works but uh usually it feels too repetitive and uh sparse so especially when it's just row of similar boxes with a limited uh imagery. So yeah I think adding a type images and clear grouping would make the page feel more uh intuitive. So I think I I can start working on it and
John Stechyshyn: Okay, we'll go solution right now.
Oleh Pedchenko: uh yeah I
John Stechyshyn: I just want you to I'm exposing you and then you can formulate what you think. Um, let's get he can you can look at this later,
Oleh Pedchenko: see
John Stechyshyn: but I want you to see the brand pages. I don't they're not here. Uh, Vulva, there should be brand by brand by brand ad top right. No, scroll out. These are a lot of the brands to the right. Right there. Zoom in. Yep. So, here are the brand pages. Scroll. There's Go to the left.
 
 
00:43:02
 
John Stechyshyn: There's Ventrak. To the left. Right there is Ventrak. Right. So, we have to have when we put when we land on a brand page, I think we should have brand content specifically. Right. And then maybe there we should have parts and parts diagrams from there. I don't know what the best functionality is here. I truly don't. I'm just trying to represent all of our brands.
Oleh Pedchenko: for now it's like generic uh I think when a user lands on a brand page
John Stechyshyn: So
Oleh Pedchenko: it should feel brand specific but now it's like generic I think you should have brand content on the top I think but Yeah.
John Stechyshyn: come up with that idea too. So this part of my thinking is right now we are just New Holland. So it's it it is in it is going to be generic.
Oleh Pedchenko: Mhm.
John Stechyshyn: New Holland is 60% of the business that we do here. So that's why we started with it. It's huge.
 
 
00:43:54
 
Oleh Pedchenko: Mhm.
John Stechyshyn: And there are 49 other vendors or 50 other vendors or brands that make up the other 40%. Now that is not to make them small because we really think we have huge opportunities with some of these uh outside the US brands. Male is an Irish brand. Male there are very few dealers. So within the US, we could be a very primarily parts dealer for that for all of the US. So there's some of these Ventrak, we're one of the very few good dealers in the country. Ferris are the number one dealer in the country and yet we only have a local parts presence.
Oleh Pedchenko: Mhm.
John Stechyshyn: So we believe that we can open that up nationwide. And so you get my point. Scroll through the brands just to show them some of them. Uh VVA, if you would to the right, you can look at these later, but Maria kind of there's Ferris. Next one's male, right? We've got content and we have access to uh uh dealer pages.
 
 
00:44:58
 
John Stechyshyn: So, we can scrape dealer marketing content or just download uh pictures and all this. So, I want you to be aware that that's if we have if I have to ultimately hire someone that just gets the images and content for us,
Oleh Pedchenko: I got
John Stechyshyn: I'll have to think about doing that. But, you know, I wouldn't mind if Maria did that,
Oleh Pedchenko: it.
John Stechyshyn: but she doesn't, you know, VVA. So, um I have someone that could probably do this if she wanted to dig in and do it and provide that content. Um but the point is this is the vision that I have is brands are look pretty. They have current models, current cool photos, uh most importantly parts centric content that drives our authority and our SEO, right? Um and structure so the slugs uh VVA can talk to. I don't know how I can't remember if either of you have e-commerce background at all. Uh is do you Ola I don't recall you or Dennis have e-commerce at all? You do.
 
 
00:46:09
 
Oleh Pedchenko: Yep.
John Stechyshyn: So you understand the SEO and the indexing and all this stuff is so crucial that we want to we want to prepare for that right we want to prepare because even even though we took it very seriously VA you can speak to this. We took the SEO very seriously and yet when we went live we f***** up right? We had things that were not perfectly clean and we had to fix things in order for our indexing to work right. Okay. Because it's such a massive site and uh so we want to we've learned some lessons. I know VVA VVA probably can speak to the technical side that we want to make sure and he'll be checking things anyway, but let's not wait till the check. Let's engineer this the way we want to engineer it. The other reason I want you to look at this stuff is because every brand these smaller brands like Ventrak and Ferris are going to be have see how see how this is New Holland okay New Holland has all these man these different categories now sorry I'm waving at you uh ADCO will be like this male will be a balor male has bailers stop has bailers has mowers has hay tools right has forge equipment maybe they don't have the rest of it.
 
 
00:47:28
 
John Stechyshyn: ADCO will have all of these things. Now, when we talk about Ferris and Ventrak, they will have very different categories. They're com more niche market and they'll have categories, but they will be different attachments and so forth. So the point is is as we look at these to structure our site, I want you guys to be thinking forward about that because I need your help being strategic in this, not just tactical. Hope all that makes sense so far.
Vova Pirotskiy: Yeah.
John Stechyshyn: Version two for next week. Ola front end. What I really want is better front end mobile and desktop. I want it bug-free. I want it to be easily usable. And I don't want to have these circular references. Can you show me uh I want to give an example, Vulva. If we click on tractor here. Okay. Um and you pick Boomer 40, let's say. This any of them. Pick it. This might not be the place that I'm thinking.
 
 
00:48:37
 
John Stechyshyn: Okay. So now if you're here now, click open parts diagram right there and the big center screen. Well, where will it go? It'll go back here again. Uh go to um go to the parts store at the top. This is maybe a bad example, but the parts store. Now let's just put T5 in the search bar. T5. T5 in the search bar. Okay. Hit enter. Okay. Now you see the models that you can come up to. Right now there's model part list and there's diagram. So if I click that first one, it doesn't matter. Click one. Yep. That takes me here. Um, there was another part where we're getting a lot of just going back to some of these menus. Anyway, look at that. Look at the navigation of it. Um, and also look at the navigation. I added the stupid parts breakout, but it's the only way I could think of it.
 
 
00:49:39
 
John Stechyshyn: So, VVA, if we can Ola and Dennis here. Yeah, let's close it first and let me just walk through this. User has a T5 110 tractor and they're like, I need to find a part. So, this is like 95% of the scenario. I have this tractor. I know which one it is. I found the parts diagram main page and I know I need some kind of a part, but I don't know where to find it.
Oleh Pedchenko: Mhm.
John Stechyshyn: If you notice, this is part of point of interest. Ola, if you scroll here a little bit, just scroll up and down. Vovva, if you're a user in my shop with my parts, they want to look at this and they want to say, "Okay, which one do I need?" They want to scroll. Okay, I need that one. I need that image. It's a It's like the trunk of my car. I know it when I see it, right? So, they go back, please. So, the point I'm trying to make for mobile is this doesn't exist for mobile.
 
 
00:50:41
 
John Stechyshyn: on mobile you you only have that um on the left side you only
Oleh Pedchenko: Mhm.
John Stechyshyn: have Okay, thank you for that. You only have this on mobile. So if you se if you dive into there,
Oleh Pedchenko: Mhm.
John Stechyshyn: there's a lot of menus that are meaningless to you. You don't really know if they're true or not. So if you can go back to um you wouldn't like see how they're all the similar, you'd get lost trying to just choose which one of those. So, if you go back vulva to the desktop version. Um, so now you're here and let's say you're not a master and you don't know which picture you want, but you want to know what part it is. Well, maybe from right within here, I want to know I want to find a part. I don't have a part number. I don't know what a part number is. I'm just a consumer. Well, I want an oil filter. Let's say the next step would be to go click at the top top right.
 
 
00:51:33
 
John Stechyshyn: You'd be searching for the part by description. Top right. Top right.
Vova Pirotskiy: Right.
John Stechyshyn: Click here. Navigate. No, no, no. Top right.
Vova Pirotskiy: This
John Stechyshyn: Above the tractor going across the screen. Right there. Right there. Up. Right there. Yeah. You where you were before the pop out. Oh, whoa, whoa.
Vova Pirotskiy: ah this
John Stechyshyn: Yeah. So, this pop out, which is just something that I created because it was lacking, right? But this may not be a great navigational tool. Okay. This is just something I put But what we what this allows you to do first of all
Oleh Pedchenko: Yeah.
John Stechyshyn: um vulva scroll through the images in the middle in the middle uh sorry I mean hover over the images they should pop out okay so the images pop out so you can scroll this way but you can also do it like this type in the search box filter at the
Oleh Pedchenko: Yeah.
 
 
00:52:26
 
John Stechyshyn: top okay so now you're sorted on filter just for this model Right. And you now you can see which filter by the image, but you can also look at which diagram it's on. And then if you choose the diagram, it takes you back to the diagram that you need to look at. Go back to that diagram. That's fine. So now you're in this diagram. You can pick the part, add it to cart, select it on the diagram, whatever you need to do. Order the part. All of this to me feels like version one, right? Not version 10. This looks like version one to me. So, this is where we're looking at trying to improve. I I actually I love this screen. It's my favorite screen. Personally, mine. Um I think it's easy to navigate this. It's easy to add the part. This part is good. It's some It's something about getting to this both on desktop and mobile that makes it there are improvements that we need to make.
 
 
00:53:29
 
John Stechyshyn: Okay. So I just walk through that with you to tell you my commentary, my position, my opinion. So we need to layer this step one that we have with multiple brands that are coming in. Male, Marquest, Ventrak, Ferris. They are different styles of vendor. They will have Could you take us to uh now take us to development and I want them to see the new brand all brands on development.
Vova Pirotskiy: Mhm.
John Stechyshyn: You can go to the main page and then scroll down to all brands.
Vova Pirotskiy: Mhm.
John Stechyshyn: Okay. So, oh this is not this not crop dev is it?
Vova Pirotskiy: Just
John Stechyshyn: Yeah, there we go. So, all brands at the bottom. So, now VVA has added in male, Ventrak, and Ferris. And we're waiting for Marcress to be wired in. But if you click on male or whatever, Ferris is fine. Now, this is he's not there yet, right? He's not there with the navigation. And but you'll see what I want you to see from this is what I was talking about accessory.
 
 
00:54:40
 
John Stechyshyn: Okay, some of this these five numbers are very important. They say a lot. These f soable item uh vulva and Dennis and Ola the 59 numbers tell us a configuration of the new mowers. Scroll all the way down to commercial mowers, please. Okay, walk. That's fine. Walk behind more. It's a commercial mower. So, if you select that, that 590 number means a specific configuration. So, if a customer knows that 59 number, that's how they're going to find their their diagram. So, if you could just select one of those 59, where'd you go? You keep scrolling on.
Vova Pirotskiy: This. No. No.
John Stechyshyn: No, no. Scroll up to commercial moment.
Vova Pirotskiy: This.
John Stechyshyn: We're You're on attachment. Well, you went all the way back up on me. Holy f***. Who's driving this f****** car? Scroll down. Yeah, walk.
Vova Pirotskiy: Which one?
John Stechyshyn: That'll be fine. Right there. Commercial. Okay.
 
 
00:55:39
 
John Stechyshyn: So, choose one of those. So, this is a particular configuration. There's a mower deck. There's 28 parts. Click on that. Okay. So, it's doing this flashy flash s***. I don't know what that is. Ola knows exactly what that is and he's going to fix it. Um, so this is the point like this is where uh this is where Voga has it at this point. Next week I want these vendors to be ready to go to production and it's on you guys to figure out how to do it. Ferris, Ventrak, Male, and Marrest. That means they have to have brand landing pages. That means our structure and our slugs ready for SEO. That means that the the interface is working cleanly. That means we have testing. That means we know it's broken, Dennis, before it's fixed, right? Um or we know that it's fixed before it's broken. Yes, sir.
Oleh Pedchenko: Yeah. Okay. I understand.
 
 
00:56:47
 
Oleh Pedchenko: So the immediate goal is to to take those new brands from uh particularly with development state to production ready next week and uh with stable navigation, no visual uh glutes uh and clear passing to diagrams and parts. So uh as I also understand so that for a brand uh like is it told ferris so those configuration number are a primary user uh entry point so that uh look up follow needs to be uh reliable and easy to use.
John Stechyshyn: Absolutely.
Oleh Pedchenko: Yeah.
John Stechyshyn: And this is this will be the first time that our search will now be multibrand.
Vova Pirotskiy: Yep.
John Stechyshyn: So when someone puts a part number in, if it's part of two manufacturers, because a part number can be the same for two brands potentially, we you're it's I think the point you're making is search is going to be critical because it's going to be much more complicated when we're not using just the New Holland data set. We're now using alternate data sets,
Oleh Pedchenko: Excellent.
John Stechyshyn: right?
Vova Pirotskiy: Yeah. But uh the part with the search I think uh the part was the
 
 
00:57:57
 
John Stechyshyn: Alex,
Vova Pirotskiy: search Daniel.
John Stechyshyn: Alex and D.
Vova Pirotskiy: Yes.
John Stechyshyn: So, we'll get we'll get Dan involved in that piece. But now you guys are here and he is not. Okay. He is on your team. Uh VVA's working on this piece a lot too. So let's just figure out how to split the the but this is version two which means it's not production which means that you guys have some freedom to a degree working with VVA to really try to come to what is most important for us what is doable what adds the most value. So I don't want you just to be task masters. I want and I it's a balance. Okay, I'll say this one time only. It is a balance between having great ideas and being able to do great work. Okay, there's a there's good is better is good. Uh perfection is the enemy of good, right? Perfection is the enemy of good. Let's put out a good product next Friday.
 
 
00:59:10
 
John Stechyshyn: Any questions? was I hope I was clear enough to give direction there.
Oleh Pedchenko: Okay.
John Stechyshyn: I was going to say the last thing about Dan not being here is that he's our search guy, right, VVA? So, in the green team chat, he is now has a gap of knowledge. You guys bring him up to speed on what is going to be needed from him as you just heard it from me. See it from me. I'm not asking you to give him directive. I'm asking you to tell him this is what we just heard and there's this going to be this gap with search. Let's talk about it,
Oleh Pedchenko: Yeah.
John Stechyshyn: okay? And you guys figure that part out. Va, do you think that's fair? Am I off base on any of this? You have anything to
Vova Pirotskiy: Yeah, maybe I maybe I will just give him some agenda.
John Stechyshyn: add?
Vova Pirotskiy: But overall, yeah, also I wanted to say that feel free to open some issues.
 
 
00:59:57
 
Vova Pirotskiy: Uh just let me know. I will review with the John and but you can open and uh it would be
Oleh Pedchenko: Heat.
Vova Pirotskiy: nice.
Oleh Pedchenko: Yeah, I I have a question uh about uh opening new issues. Uh in my scope and when I work uh when I see some problems, maybe uh some small bugs uh I don't create uh a new issues, I just uh fix it and uh uh introduce in my uh in my issue uh in GitLab. So maybe I need to create new issues or work like that. So just uh just
Vova Pirotskiy: I think I think for small one I think for small one you can you can
Oleh Pedchenko: and
John Stechyshyn: absorb it somewhere.
Oleh Pedchenko: like
Vova Pirotskiy: just uh
John Stechyshyn: Absorb it somewhere, you know, but it don't create like if it makes sense.
Vova Pirotskiy: Okay.
Oleh Pedchenko: Okay.
John Stechyshyn: What I don't want to do is have this issue sprawl, right? Where we have so many issues and then they just don't get worked on because there's so many and then we forget what they
 
 
01:00:54
 
Vova Pirotskiy: Yeah.
John Stechyshyn: are. So, I would say um somehow maybe have Maybe you should describe it in a backlog issue because having many issues means you got to open them and talk about them.
Vova Pirotskiy: Heat.
John Stechyshyn: Maybe partly it would be like having a task list like a backlog issue and you just add
Oleh Pedchenko: Okay.
John Stechyshyn: your commentary to that and you can go review it and if it needs an issue later you can add one. Again, I'm going to let you guys decide how you want to handle those things. That's up to you. I just know that what I don't want to see is I don't want to pull my repos, query them, ask my claude about them, and then have them have all these issues that I don't understand. It would be really nice if I have some kind of a impact statement. By the way, Oie, that you did earlier. That speaks to me. It's like, why are we doing this, right? Just a quick so I don't have to read all the technical detail of it.
 
 
01:01:56
 
John Stechyshyn: It's just too much to read 400 for 400 issues. So, if I just can read quickly um what's happening also in the chat messages too, right? If I can just read quickly like at the beginning, why why am I reading this? It's like why am I reading this? I just want to know why and then if it's important, I'll read it. Um so that that would be good. And nobody does a good job at this really other than Alex.
Oleh Pedchenko: Okay.
John Stechyshyn: He's probably the best. Um he's gotten a little bit lazy too with it where he's just relying on the technical, but he's always been really good at this. V is terrible. Everybody else is terrible. So, not really. It's not that bad. It's just I'd like to do a little better, truthfully. Okay, I'll let you guys handle it from here.
Vova Pirotskiy: That's good.
John Stechyshyn: If you have questions, you know where to find me. Okay.
Oleh Pedchenko: Okay,
John Stechyshyn: Thanks, guys. Appreciate it. Bye.
Oleh Pedchenko: guys.
Vova Pirotskiy: transcript
Denis Baranov: Are
Vova Pirotskiy: tree.
Denis Baranov: we
Vova Pirotskiy: Mhm.
Denis Baranov: refactoring? Feel free workflow. foreign.
Vova Pirotskiy: No. Is it okay? Ah.
Denis Baranov: Wow.
Vova Pirotskiy: Okay. Mhm. Mhm. Mhm. question. Mhm.
Denis Baranov: Another
Vova Pirotskiy: Mhm.
Oleh Pedchenko: office.
Denis Baranov: design.
Vova Pirotskiy: cookies. Mhm. Okay.
Oleh Pedchenko: Mhm.
Vova Pirotskiy: Um. Mhm. Feature slice. Modernist.
Denis Baranov: I got the door.
Vova Pirotskiy: We delighted of model. We delighted of
Oleh Pedchenko: What?
Vova Pirotskiy: Mhm.
Denis Baranov: No
Vova Pirotskiy: Mhm. Okay. No.
Denis Baranov: tax.
Oleh Pedchenko: No.
Vova Pirotskiy: done. Yeah. No. Okay. Mhm.
Denis Baranov: He proed.
Vova Pirotskiy: I'm sure the Mhm.
Denis Baranov: Okay.
 
 
Transcription ended after 01:07:59

This editable transcript was computer generated and might contain errors. People can also change the text after it was created.

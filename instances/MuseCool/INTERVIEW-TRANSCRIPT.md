# Расшифровка собеседования MuseCool

> Источник: `1.html` — экспорт субтитров Google Meet.  
> Участники: **Petru Cotarcea** (интервьюер), **Denis** (кандидат; в субтитрах — «Вы»).  
> Упоминаются: Valeria (Lera), Lara, Lizzie (текущий разработчик, уходит в декрет).

Субтитры местами искажены (английская речь, автоматическое распознавание). Ниже — структурированная расшифровка с правками очевидных ошибок.

---

## Краткое резюме

| Тема | Суть |
|------|------|
| **Компания** | Музыкальное EdTech — игры для практики между уроками (аналог Simply Piano / Duolingo) |
| **Роль** | Frontend + владение музыкальными играми, метрики вовлечённости |
| **Замена** | Lizzie уходит в декрет (~конец июля), год на адаптацию |
| **Дедлайн** | Улучшенные игры к **сентябрю**, платящие родители к **ноябрю** |
| **Следующие шаги** | Референсы (Source Digital, Live.io), исследование конкурентов, возможный trial |
| **Риски (со слов Petru)** | Мало вопросов и исследования на интервью; тема мобилизации — чувствительна для команды |

---

## Часть 1: AI и инструменты разработки

**Petru:** Сколько вы пишете код вручную?

**Denis:** Сейчас использую AI во всех задачах. У меня есть ruleset, который я сам создал. Для планирования: если задача большая — сначала прошу AI разбить на меньшие, потом выполняю по одной.

**Petru:** Справедливо. Какую платформу используете?

**Denis:** Cursor — основной. Ещё переключаюсь между Claude и ChatGPT, чтобы следить за новыми версиями и фичами. Рынок AI сейчас меняется очень быстро.

**Petru:** Сколько токенов в месяц тратите? Отслеживаете?

**Denis:** Около $20 в месяц. Точно по токенам не знаю. Больше фокусируюсь на планировании — если план хороший, не нужен Opus и много переписки.

**Petru:** Понятно, умеете настраивать. Не будем затягивать — 15 минут. Переходим дальше?

**Denis:** Да, давайте.

---

## Часть 2: О себе, хобби, игры

**Petru:** Denis, расскажите о себе. Как проходит день? Кодите 24/7? Футбол? ТВ? Чем занимаетесь?

**Denis:** Живу у моря, каждый вечер могу плавать. Есть собака — французский бульдог, он рядом со мной. Живу в деревне, выращиваю помидоры.

**Petru:** Дома, с собакой. А для развлечения? Видеоигры?

**Denis:** Не люблю видеоигры, не хочу тратить на них время. Открываю Logic Pro, беру сэмплы, играю на барабанах и басу.

**Petru:** Делаете музыку для себя?

**Denis:** Да. Примерно раз в неделю — в пятницу вечером, чтобы переключиться. Пробую идеи, если что-то интересное — отправляю друзьям. В бэнд-группе делали hip-hop, придумывал партии и скидывал ребятам.

**Petru:** Всё ещё играете вживую?

**Denis:** Да. Музыка сейчас — не работа, а способ общения с людьми.

**Petru:** Опыт с видеоиграми вообще?

**Denis:** В Dev.Pro делали лендинги с мини-играми для рекламы. Например, игра к 1 сентября — ребёнок ловит школьные принадлежности. В Live.io работал над анимационным редактором для интерактивных квизов с аватарами.

**Petru:** А сами играли? Counter-Strike?

**Denis:** В студенчестве — Need for Speed Underground, может ещё одна игра.

**Petru:** Underground! Я тоже в детстве играл. Мы из Восточной Европы, я румын — культурно близко.

**Denis:** Да. Поэтому за рулём с 18 лет.

---

## Часть 3: Референсы и суть роли

**Petru:** Осталось ~8 минут. Если пойдём дальше — нужны референсы. Lara, позвоните по контактам. За последние 2 года — Source Digital и Live.io. Denis, есть контакты?

**Denis:** Могу дать email и LinkedIn CTO с обеих компаний.

**Petru:** Отлично — LinkedIn, телефон, email. Lara, Denis пришлёт. Denis, после звонка — как вы понимаете свою роль, если начнём завтра?

**Denis:** Работаю напрямую с Valeria. Она готовит данные, сценарии, идеи для игр. Я беру документ и делаю игру или интерактив. Начинаю с дизайна.

**Petru:** А как вы представляете эти игры?

**Denis:** Что-то вроде викторины по истории музыки. Пробовал объяснить AI идеи про музыкальные trivia-игры до звонка.

**Petru:** *(важно)* Trivia — это **маргинальная** часть. Сложное — **музыкальные игры**. Цель компании: дети практикуют музыку между уроками. Учитель учит → мы делаем музыкальные игры, как Duolingo или Simply Piano. Ребёнок играет на пианино, мы слушаем в реальном времени: «молодец» / «попробуй ещё» / очки. Trivia и теория — вторичны.

**Denis:** Понял.

**Petru:** Задача — сделать игры **весёлыми, стабильными, интерактивными** и отслеживать вовлечённость. Есть beta-пользователи: если ребёнок попробовал раз и ушёл — плохо, нужно понять почему и итерировать. Опыт владения проектами?

**Denis:** ~3 месяца назад закончил мобильное приложение Navitrack — трекинг машин, баланс бензина и т.д. Работал как fullstack-разработчик.

**Petru:** Ок. DevOps?

**Denis:** Немного — деплой несложных вещей на сервер.

**Petru:** DevOps у нас есть индус в штате. Denis, ваши вопросы?

---

## Часть 4: Вопросы Denis (и реакция Petru)

**Denis:** Хочу увидеть кодовую базу — проект не с нуля. Нужны документы для понимания целей.

**Petru:** Вопросы **сейчас**, до изучения материалов?

**Denis:** Нужно глубже изучить сайт New School и продукт, попробовать мобильное приложение — тогда задам конкретные вопросы.

**Petru:** Пока нет вопросов?

**Denis:** Не хочу задавать плохие вопросы — хочу хорошие.

**Petru:** Обычно ждут вопросы про мечту компании, направление…

**Denis:** Нужен документ по игре, который Valeria показывала в начале.

**Petru:** Общие вопросы? Покажите любопытство — вы на интервью.

**Denis:** Как работаем с оплатой? Swift, перевод?

**Petru:** Первый вопрос должен был быть про деньги — правило интервью. Да, банковский перевод на украинский счёт раз в месяц, обычно без проблем. Lara тоже может рассказать.

**Denis:** Какие дедлайны? Хочу видеть план работы.

**Petru:** Хотел услышать про **мечту и направление компании**, а не только про свой job. Пока не впечатляет. План: лето — улучшить игры к сентябрю (начало учебного года). Сентябрь–ноябрь — нужно определённое число родителей, платящих за игры, чтобы получить инвестиции. Мы хотим, чтобы это приложение стало **стандартом музыкальных уроков в мире**. Начинаем с пианино, потом гитара, скрипка. Ваша роль — музыкальные игры: делать, чтобы были весёлыми и чтобы детьми **реально пользовались**. Frontend + владение игровым пайплайном.

**Denis:** Понял.

**Petru:** У вас есть ребёнок для тестирования?

**Denis:** Да, сын может играть и давать фидбек.

**Petru:** Ещё вопросы?

**Denis:** Нет пока.

**Petru:** Сыграйте в игру! Придумайте вопрос.

**Denis:** Тысяча вопросов, но нет времени.

---

## Часть 5: Lizzie, сентябрь, пианино

**Denis:** К сентябрю нужно что-то интересное, потом пианино, потом другие инструменты?

**Petru:** Сейчас вашу роль делает **Lizzie** — она беременна, уходит в конце июля на год. Вы её **заменяете**. Работаете с ней, она покажет что есть. Игры уже есть — не с нуля. Пока только **пианино**, другие инструменты — через год+. Учитесь у неё быстро, потом берёте на себя. Год, чтобы доказать себя.

**Denis:** Нужно изучить существующий код?

**Petru:** Valeria поможет с контекстом. Поделитесь исследованием конкурентов. Valeria — ещё 10 минут покажите приложение: тьюторы, родители, разные воронки.

**Denis:** Покажу со своего аккаунта, с точки зрения тьютора.

---

## Часть 6: Обратная связь Petru

**Petru:** Denis, вы опытный и приятный, но **не впечатлён уровнем исследования и общим интересом** — это минусы. Если пойдём дальше — нужно **глубоко** понять конкурентов и продукт. Будьте проактивны. Возможен trial на неделю. Valeria — не спамьте сообщениями (максимум ~1 в час). Нужно доказать, что понимаете контекст и **реально заинтересованы** — пока это не очевидно.

**Denis:** Понял, постараюсь.

**Petru:** Lara, что упустил?

**Denis:** Постараюсь всё объяснить.

---

## Часть 7: Мобилизация и честность

**Petru:** Denis, вас пригласили к вам — обычно кандидаты едут к нам. Вопрос напрямую: **мобилизация**? Есть документы? Насколько вероятно, что завтра вас заберут?

**Denis:** *(с переводом)* Есть медицинские документы, но не сильные. Стараюсь не выходить на улицу, искать разные автобусы… Проблема есть, гарантий нет, но какие-то документы есть.

**Petru:** Спасибо за честность. У нас есть украинские коллеги, у некоторых родственники в армии — это **неловкая тема**. Был коллега Егор — в первый месяц войны уехал, мы помогали, но стало напряжённо: люди в стране сражались, а он жил за границей на немецкие деньги. Лично я понимаю вашу ситуацию. Но в этой работе нужно **доказать полезность** — работать усерднее, быть проактивным. Для части команды это «тяжёлая» тема. Нужно реально доказать себя.

**Denis:** Понял.

---

## Часть 8: Завершение

**Denis:** Нет времени — нужно вернуться к текущему проекту, много сообщений от команды.

**Petru:** Текущая работа?

**Denis:** Нужна ещё **неделя**, чтобы закончить.

**Petru:** Хорошо знать. Lara, спасибо. После разговора с Denis — ваше мнение, референсы. К завтра позвоним. Denis, приятно познакомиться, надеюсь поработаем.

**Denis:** Спасибо.

---

## Приложение: полная сырая расшифровка (172 реплики)

<details>
<summary>Развернуть</summary>

**[1] Petru Cotarcea:** how much do you wipe code?

**[2] Denis:** now, I using AI in All tasks because I have some.

**[3] Petru Cotarcea:** Yeah.

**[4] Denis:** ruleset created by me and For planning. I get some bigger. Tasks, Ask AI First. Can you separate on smaller tasks? and then run one by one for

**[5] Petru Cotarcea:** That's fair enough. Okay, what platform do you use? I'm just curious for yourself.

**[6] Denis:** I'm using Cursor. and the cloth and c h between it for understand what new in this version because it's now with Wild, Wild West Green markets on need to be needed news and See new features and understand how it worked so something this but Corso is my

**[7] Petru Cotarcea:** Okay.

**[8] Denis:** favorite. Maybe I like

**[9] Petru Cotarcea:** That's cool. I how many tokens do you use every month for yourself? Just curious. Do you track it?

**[10] Denis:** I spent about $20 per month and

**[11] Petru Cotarcea:** my intensive tokens do you know,

**[12] Denis:** um, I don't know, I'm just by problem about $20, and using aftermod. And I focus on Too much on the planning. Because if you have good plan, you don't need. Opus model and spend much talking to you.

**[13] Petru Cotarcea:** I don't know. So you know how to customize them. I appreciate that. Cool. All right, I don't want to keep this too long item. 15 minutes. So, I suppose next thing is, let's letter has another questions. Do you have anything to do basketball? They are or work. Mats. Good, move on better.

**[14] Denis:** Yeah, move on.

**[15] Petru Cotarcea:** Okay. All right. Denis, tell me about yourself a bit like what do you enjoy doing? So your average day You just codes like 20 hours a day. Do you play football? Do you watch TV? Like what you, what you enjoy? What's your life like?

**[16] Denis:** Them, now I'm leaving the C. So I every evening can go to see and swim. I have dog.

**[17] Petru Cotarcea:** Look okay.

**[18] Denis:** Fridge. What car?

**[19] Petru Cotarcea:** Friends. Welcome.

**[20] Denis:** It's great, French French. Bulldog

**[21] Petru Cotarcea:** Okay, cool.

**[22] Denis:** He is right here. We can show you near me.

**[23] Petru Cotarcea:** Right. It's a dog. I'm a dog person, okay. But

**[24] Denis:** Now, I'm leaving the village, so I Tomatoes, growing now.

**[25] Petru Cotarcea:** The rest life. Okay. Okay. So But they kind of stay home. Basically, don't to just see Dog and does that, okay? I understand. So, what you do for fun? I'm asked, like, What are you into her into video games are into like watching?

**[26] Denis:** No, I don't like video games. Don't, I don't, I don't want to spend time on

**[27] Petru Cotarcea:** What?

**[28] Denis:** video games. I'm like, Open the logic problem. Get some samples, get some idea. Play drums. Play bass and try.

**[29] Petru Cotarcea:** They make music for fun.

**[30] Denis:** Yeah, yeah. It's it's it's interesting. Don't like play video games and spend Much time.

**[31] Petru Cotarcea:** How much logic pro do? You do for yourself every week, like, two hours, 10 hours like

**[32] Denis:** Maybe maybe one day. Friday evening for relax and switch to Switch my mind.

**[33] Petru Cotarcea:** so, you produce basically that

**[34] Denis:** Yeah, let's just try different ideas. And if I see some it listen to me, like something interesting. I sent to my friends. For example, we try to do and did some hip hop music and when I play in the band during those, I'm have idea and make some some stuff and send to bend what you think about. And we, then we try to play

**[35] Petru Cotarcea:** You still, do you playing person?

**[36] Denis:** Yes, but

**[37] Petru Cotarcea:** So you still you make music to your friends, right?

**[38] Denis:** He yes, why not?

**[39] Petru Cotarcea:** Okay. Okay, but that happens. I'm just curious. Yeah, so you make music for fun.

**[40] Denis:** you music for me now, just some parts, some kind of communication between people and and all maybe,

**[41] Petru Cotarcea:** Okay good.

**[42] Denis:** I don't have I don't work as musician now and that not give me the money just for so

**[43] Petru Cotarcea:** For fun. I'll get that. That's probably best. Tell me you say, You don't play video games. Do you have any experience video games at all? Like a mobile games

**[44] Denis:** In Develop Dot Pro, we are working on different landing page with mini games.

**[45] Petru Cotarcea:** or Tell me what's playing or building them or anything? Any experience whatsoever? What's your contact?

**[46] Denis:** For advertising. so, for example, I remember I did some game for First September. Child can move the Little Rock package, but Back back back and catch the different things for school pencil sheets. Oh s***.

**[47] Petru Cotarcea:** Now look at that. Okay, so little games like that. What?

**[48] Denis:** For example. then I work it, when I work it in the Live.io, I'm working on Animation Editor for making some quiz interactive with animation, this some avatars going and it's look like again to

**[49] Petru Cotarcea:** That's right. Right. Okay, so we have but in terms of interacting yourself with games, do you ever like, have you had a face, or you play counter-strike, or

**[50] Denis:** Know when I was a student and I play and need for speed first only, and it may

**[51] Petru Cotarcea:** Okay. Which one?

**[52] Denis:** be one game underground.

**[53] Petru Cotarcea:** Underground. That's the one I played as well as a kid.

**[54] Denis:** I'm looking around here. just,

**[55] Petru Cotarcea:** Oh my God, they're in in Eastern Europe. Yeah, I'm Romanian myself. So we kind of grew up quite close to each other, you know? Culturally. Okay, cool. I didn't know you play too Lera. That's fun to know.

**[56] Denis:** Yeah.

**[57] Petru Cotarcea:** That the FIFA was created.

**[58] Denis:** I must go to honestly, but yeah.

**[59] Petru Cotarcea:** Yeah.

**[60] Denis:** Yeah.

**[61] Petru Cotarcea:** This one.

**[62] Denis:** That's why I'm driving since 18.

**[63] Petru Cotarcea:** Yeah, that makes sense. I see a drive you cool. So if I bucharest Okay, cool. All right, before we go because I've got a colon eight minutes, I'll probably let you be Oh, okay. Where are we at? If we go ahead basically, Denis, if you go ahead of this job, I need to console to my colleagues. And with letter, I know we need to call some references as well, so Valeria you have the CV. If you gain, guys can just talk to each other now, give some contact information, Whatever, email ideally phone number Lara, could you, please make a few calls? I'll talk to you about it and just, you know, check out the reference calls. So, Just the I think What jobs do we need? We need Anything the last two years I suppose it's fine if we just do the source digital and and you know life tutorial, do you still have the contacts for those? Probably because I think goes far enough.

**[64] Denis:** Some, some person to Approve.

**[65] Petru Cotarcea:** Yeah, ideally live manager. So we looking for

**[66] Denis:** Okay, I can send you email LinkedIn profile for my CTO on both.

**[67] Petru Cotarcea:** Cool. If you can, please do LinkedIn phone number and email. So we have all the things okay, for the other two job. So the more jobs you can do the better. I delete definitely the last two for sure. So I definitely want the source digital and life that I owe and anything else. So just email them to Lara and later I will talk about, you know,

**[68] Denis:** Okay.

**[69] Petru Cotarcea:** How conducted first, but when you do that, so make sure that's that's okay. So, Tell me after the end of this call, what do you understand your role to be? So let's say we start work tomorrow Poof, What's your job in this company? As far as you understand?

**[70] Denis:** Is they understand correctly? I will work directly with Valera, For example, Valera prepares data for the games and some scenarios ideas and other. So why Get this document document and Make some something game or some interactive things. Start from design first. I think

**[71] Petru Cotarcea:** And what do you imagine these games to be at the moment, like, even if you're wrong, what do you What do you understand this games to be? Can you describe them to me?

**[72] Denis:** You told you before I try to play and yeah. For example, something victorino. For learning music history. With different questions. When? For example. Mozart. I try to explain our DS about musical, trivia at about reading games. And so, before our call, I tried to explain our ideas about future games a bit

**[73] Petru Cotarcea:** Learn Denis, please get this. This is very important. This trivia questions are very much marginal right now, so this is great, and this is easy. What's hard about? This is the musical games. This is what you need to be able to do, okay, so the goal of this company Is to get children to practice music between lessons. so, Teachers, teach. And then based on this teaching, we create musical games. And they need to be like, Duolingo or like simply piano, Please Google that and research it, but they need to be musical games. So children play the piano and we listen in real time. It's real time and we tell them Well done or try again or can get points and all that and in between there's gonna be trivia. Yeah, there's gonna be some trivia questions, some easy theory but those are not as important. What's more important is the musical games? Okay.

**[74] Denis:** Okay.

**[75] Petru Cotarcea:** Okay, so that's the job. The job is to make those fun to make those stable to make them interactive and to track that usage. Gets higher. So to you'll have to own. The games. So, you have to also track how kids engage with them. We already have some beta users, so if kids try it once, and they never try it again. That's bad. You have to understand that then we understand why and do something and iterate. Tell me what's your experience owning projects?

**[76] Denis:** for example, to about Three months ago, I finished it. Work on mobile application. For my company. My group, my friend company called Navitrek. it's Related to tracking. cars got gas by gas balance this different That. Different tracking. Tracking. Much fruit much. On sorry. And

**[77] Petru Cotarcea:** All right, don't sweat it. That I can help.

**[78] Denis:** They work it on it all around us. Today as the warps as the developer, we can't. Stuff and something.

**[79] Petru Cotarcea:** S, you have the box experience.

**[80] Denis:** Found a little bit, not huge. But I some, for example, I know we're still. and can deploy not hard things to the

**[81] Petru Cotarcea:** Okay.

**[82] Denis:** To the side.

**[83] Petru Cotarcea:** Okay, we have an Indian guy in on the box by be nice. That's something in house. Okay, so I push my next call for a few more minutes so I suppose now it's your turn. Denis any questions for me or for Lara? I mean primary for me. You can ask later afterwards I suppose. But anything I told you, you might want to know or curious about or anything your turn.

**[84] Denis:** you first, I think I need to see some code base for some understanding what we have now and it's not zero project if I understand court, Not from scratch. second, maybe I need some Documents for investigating. And understanding. Deeply goals and what I need to do. If I, of course, if I will get the offer,

**[85] Petru Cotarcea:** Before that. Do you have any questions that you have now before you look into anything? Like about anything.

**[86] Denis:** I I need to investigate deeply, the new school site and products. And then I can try on application on mobile phone and then I ask questions detail it question.

**[87] Petru Cotarcea:** But so far the question for now.

**[88] Denis:** For now. For now, I don't have. Good question. I don't like to ask bad questions. I want to make good question.

**[89] Petru Cotarcea:** Stories. But

**[90] Denis:** And then I ask,

**[91] Petru Cotarcea:** Good. That is a heretic, curious. What the dream is, or what we try to do as a company or the things. Like that's what I usually expecting to be asked.

**[92] Denis:** for example, I need Some document for some game. For example, document, what valeria? So me on the start of the meeting, and I,

**[93] Petru Cotarcea:** It's fine. But I'm wondering. Do you have any general questions? Come on, I'll let you think.

**[94] Denis:** Don't have questions. Sorry right?

**[95] Petru Cotarcea:** I'll know, let's go. So gone. Anything that comes to mind that he curious about.

**[96] Denis:** Mmm, sorry don't have questions.

**[97] Petru Cotarcea:** Come on, where, what's the lack of curiosity? That's kind of put the interview you come to interview, You want to ask questions about the company that shows that you care. Come on, give me the chance again. Please show me that here.

**[98] Denis:** Okay, how we we work with the With. The customer. I have the Pope. And for example, I get the offer, how we will work. He You sent me transfer via Swift or other things. Well, as

**[99] Petru Cotarcea:** Here, the first question should have been about money. That's the rule of questions. The peanut butter company? Yes, it's fine. Well answer, Yes. We make

**[100] Denis:** just,

**[101] Petru Cotarcea:** a bank transport. It's why it's easy, Lara. I can tell you all about it, but yeah.

**[102] Denis:** Contract with something else.

**[103] Petru Cotarcea:** Yeah, we just transfer to your Ukrainian account. It's pretty easy once a month. So this usually no issues usually arise. The next day right later you have a foe as well. So Cool. Any other question?

**[104] Denis:** What the line, maybe the lines for you will want you you want to get the ready to use product.

**[105] Petru Cotarcea:** It was the plan. Can you raise it again? Sorry. Just don't understand.

**[106] Denis:** But I I very like to see the plan and some deadlines for implementing. Stuff.

**[107] Petru Cotarcea:** All right. Well okay.

**[108] Denis:** And and stuff in the commented. Ideas data. References and other.

**[109] Petru Cotarcea:** Show me that you can ask the point the question. All right, what's your question? Very simple question.

**[110] Denis:** I want to see something like the plant for my my work in this company.

**[111] Petru Cotarcea:** All right, so right then it's not gonna lie. I was hoping you ask about was the dream or Where is the direction or things about the company? What did you start from, you know, things like that. That shows that you care about more than just your job, because that's kind of what I'm looking for, at least, you know, for, for future interviews. This is expected. Okay, so remember that you should show more interest because that's not great so far. But what the plan is basically,

**[112] Denis:** Okay.

**[113] Petru Cotarcea:** we have summer right now. We need to code some better version of the games for September. When the school year starts and between September and November, we need to achieve a certain number of parents paying for this games in order to get more investment. um, I'm gonna volunteer this information. We're hoping that this app will be the way music lessons will happen in the world from now on. So I hope this will be the app that musicians use for all music lessons. We start to piano and then we're gonna move to other instruments, guitar violin and all these things. Your job at least for the time being if work together would be to create this musical games, make them fun and make sure that kids Use them and play them.

**[114] Denis:** You understood?

**[115] Petru Cotarcea:** So you don't just create them, you make sure that they work, you make sure that they're used, if they are not used, you need to change into track it. So, your primary job would be frontend, but owning the musical games. What happens with them, okay? That's part of the pipeline. We have other people

**[116] Denis:** He?

**[117] Petru Cotarcea:** working the rest of the pipeline. Does this ask your question for now?

**[118] Denis:** Yes cool. A you know how I will test my work. I have the child and he can play and provide to me feedback. It's interesting or not.

**[119] Petru Cotarcea:** Yeah. Any other question?

**[120] Denis:** No for now, no. I don't have.

**[121] Petru Cotarcea:** Come on but play the game you have to get it was the question come and think away.

**[122] Denis:** Thousand question to you, I don't have time to ask.

**[123] Petru Cotarcea:** Oh, you get one more even if you don't worry.

**[124] Denis:** So okay, you need to get some stuff for some September. and then, I don't understand correctly for September, we need to create Something interesting and then we Start with piano. And then at another instrument,

**[125] Petru Cotarcea:** Right, let me clarify that. Okay. So There's already somebody in the company, that's doing your job right now. It's a lady. Her name is Lizzie. She's lovely but she's pregnant. And she's gonna have a baby in the end of July. It's gonna leave us for one year so she's gonna be away for an entire year. So first and foremost you basically replace her for now. And hopefully if you do a good job, both of you can have a job when she comes back. Okay, so right now you basically continue somebody else's work. You're gonna work with lazy for a b****, she's gonna tell you what things are. She's very busy right now, so you have to be quite efficient with learning. But basically she will guide you because we already have some musical games, we already have some things. Okay?

**[126] Denis:** You okay?

**[127] Petru Cotarcea:** Your job will basically to learn from her, understand things quite quickly before she goes and then take over. We already have some things so you don't have to start from scratch. We are not gonna go into different instruments yet it's just about the piano for a distant another year. So making the piano efficient making the piano fun and getting enough users to buy that, okay? So that's kind of question so you have to learn from this lady Quickly. She goes away, you take over and you're gonna have a year to prove yourself and hopefully we'll see when she comes back. Make sense.

**[128] Denis:** Yes.

**[129] Petru Cotarcea:** Okay, cool. All right. Well,

**[130] Denis:** so if we have some part of work done, I need to Investigate this code.

**[131] Petru Cotarcea:** No forget that. We're gonna share. Right. I think I'm almost done. Just, I Mean, pull that out. Of you don't have to, unless you do.

**[132] Denis:** Don't. Need some context. So to understand it and then I get the much questions.

**[133] Petru Cotarcea:** Okay. So Valeria can help with that a bit so later before you leave to them and, you know, go home to your family soon. But, Could you share the competitors and all that? And

**[134] Denis:** Yeah, I'll share my research about the competitors.

**[135] Petru Cotarcea:** Explain as much as possible of the app while you're there. So spend another 10 minutes to show him the app. Show you what you do. Make sure you understand that. It's about tutors and it's about parents and it's different funnels and it's different apps and

**[136] Denis:** Sure.

**[137] Petru Cotarcea:** Skin. It like so just if you

**[138] Denis:** also, my own my own account and from my tutor point of view,

**[139] Petru Cotarcea:** So, you don't have to share everything. If we go ahead with this higher, we're gonna have more time to go into it, but I want to Denis to have as good of an idea as possible before we decide what to do next because we, you know, I just want to see. How fast you move if you're learning. So then it's what's expected of you Right now. I'm gonna talk to my colleagues about what to do next. Um you seem experience you seem like nice enough, I guess I'm not impressed by your level of research. And by a level of general interest. So these are the black dots from this interview. You need to prove yourself that this can be overcome. So if you move ahead in the next week or two, you need to really understand the competitors. You need to really show that you understand what the product is. Okay? And what we're trying to do be proactive. So I expect you to really research We might have another call, we might say. Okay, let's start with a trial in a week or so by that time you should really, really understand the market as well as possible. You can ask letter a few questions. Please don't message later too much because that's annoying. Okay, so please be respectful to messages one an hour. Let's say no more than

**[140] Denis:** Okay.

**[141] Petru Cotarcea:** that. Your social letter doesn't have to spend the entire day answering, you either. Okay, not at this point if work together. Maybe she can spend more time, but right now, we still deciding So right now, that's what you need to prove to me, for me to be able to, to move forward. Show me that you really can understand the context can do research. And I properly interested. Into this work, okay? Because I'm not obvious, that's the case yet.

**[142] Denis:** Okay.

**[143] Petru Cotarcea:** Okay. Lara. Did I miss anything? Anything that's in the room? Elephant, the room. I should ask about, or

**[144] Denis:** No, I'll try to do something from my from my side. I'll try to explain everything.

**[145] Petru Cotarcea:** oh,

**[146] Denis:** Wanted. Yeah, I know. I know what I want to tell Denis now.

**[147] Petru Cotarcea:** Okay. Maybe spend another half an hour now, but please don't, don't worry too much. You need to go home as well.

**[148] Denis:** Yeah, I need to go home. Sure. It was not home.

**[149] Petru Cotarcea:** Yeah, I don't very much for the trouble. I'm very grateful. So, basically, Denis normally we invite people to make an effort for the interview to travel to us to show that you guys care and all that. Now we came to you Okay, I understand. I understand what's happening. Tell me you about to be

**[150] Denis:** With you.

**[151] Petru Cotarcea:** drafted, or what's, what were you hiding about? So, do you have already papers in your name? That have your name and try to hide, or you just try not to get this papers. Like, How likely is it that you're gonna leave us tomorrow? Basically, because somebody knocks on the door.

**[152] Denis:** And sorry. And can I translate, okay?

**[153] Petru Cotarcea:** Okay, I want us to be honest as possible, right now, please.

**[154] Denis:** Here that's okay with sovereign installation, document shop shooting a spokeness but even know just say it's super blog, I have some medical becomes but it's not strong. The comments and I try to Not. Go to the streets and look for different different buses and other. So, it's problem. I know. And I don't get any guarantee, maybe, but I have some documents but it's not.

**[155] Petru Cotarcea:** And that's fine. Okay, I understand. Thank you Denis again, for the sake of transparency just so we're a very aware of what's happening here. We have a few Korean colleagues of Valyria, is one of them. Some of these Ukrainian colleagues have family in the army and this is a bit awkward, Okay? I used to have a colleague. In Ukraine called Ehor which is not working with us anymore. When the war started, he fled in the first month and at that point, we helped him and try to be supportive and all. But he became quite awkward because there were people in the country. They were trying to fight and there are people, He was obviously abroad, doing fuckal and kind of just living with money from Germany and all that he became a bit tense. So point being, I am personally sort of okay with your situation. I understand is difficult and I can't judge because I'm not there. And what would I do? But please be aware in this job, that sort of hanging above us. You have to prove that, you know, How do I put this? Please be really useful in this job and you have to work extra hard that you're proactive and you really care about this job because there's already a bit of heaviness on like, Hey, somebody's hiding and does not cool. Okay, so I'm

**[156] Denis:** Okay, that

**[157] Petru Cotarcea:** personally, if my colleagues are I'm probably willing to get over this and make it work. But just say no, please, you really need to prove yourself.

**[158] Denis:** Okay.

**[159] Petru Cotarcea:** If we work together the understand. The difficult situation but just because it's making a few of us uncomfortable starting with myself. Alright.

**[160] Denis:** All right.

**[161] Petru Cotarcea:** So yeah, that's all I wanted to say, to put it out there, any questions about this? Any thoughts and my valeria that I handle this? Well,

**[162] Denis:** Mmm, I don't have a question and don't have time. I need to back to my current project. I have it, and I need to have a lot of messages from team. So if we can

**[163] Petru Cotarcea:** So existing work. So I mean

**[164] Denis:** Yeah, I need to one week to finish.

**[165] Petru Cotarcea:** Okay, that's good to know. I wasn't aware of that, but

**[166] Denis:** After the, if I get the

**[167] Petru Cotarcea:** Of course, okay.

**[168] Denis:** So, if we can, Go into end. It's Let's do it because I need back to work.

**[169] Petru Cotarcea:** Interesting. Okay. All right later. Thank you very much for your time. I really appreciate this. Let me know we'll call me after you finish with talking to Denis and you tell me your opinion and please get the references. They must know that and hopefully by tomorrow we call them all and see what happens. Then is it's a pleasure meeting you, hopefully work together. Hopefully, we do great things together. Okay.

**[170] Denis:** First. Okay.

**[171] Petru Cotarcea:** Have a good day, thank you.

**[172] Denis:** My life. just, yeah, there's never because it competitors International Competitors.

</details>

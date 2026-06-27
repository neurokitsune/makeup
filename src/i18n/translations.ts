import type { Lang, Loc } from '../data/types'

export type UIKey =
  | 'eventName'
  | 'appTitle'
  | 'homeTagline'
  | 'homeIntro'
  | 'start'
  | 'chooseStyle'
  | 'chooseLook'
  | 'back'
  | 'showToArtist'
  | 'madeBy'
  | 'prev'
  | 'next'
  | 'winInContest'
  | 'chancePrompt'
  | 'chanceWoman'
  | 'chanceMan'
  | 'chancePreferNot'
  | 'tryAgain'
  | 'randomName'
  | 'randomTagline'
  | 'contestName'
  | 'contestHeader'
  | 'contestTagline'
  | 'contestPrizeNote'
  | 'contestHow'
  | 'contestStep1'
  | 'contestStep2'
  | 'contestStep3'
  | 'contestStep3Tag'
  | 'contestStep3Or'
  | 'contestInputLabel'
  | 'contestSubmit'
  | 'contestSuccess'
  | 'contestWinnerNote'
  | 'contestEventName'
  | 'share'
  | 'sharing'
  | 'shareSaved'
  | 'shareError'
  | 'shareText'

export const UI: Record<UIKey, Record<Lang, string>> = {
  eventName: { be: 'varushniak', en: 'varushniak' },
  appTitle: { be: 'makeup', en: 'makeup' },
  homeTagline: {
    be: 'Твой вобраз на ноч Купалля',
    en: 'Your look to celebrate Kupalle night',
  },
  homeIntro: {
    be: 'Абяры свой стыль',
    en: 'Choose your style',
  },
  start: { be: 'Пачаць', en: 'Start' },
  chooseStyle: { be: 'Абярыце стыль', en: 'Choose a style' },
  chooseLook: { be: 'Абярыце вобраз', en: 'Choose a look' },
  back: { be: 'Назад', en: 'Back' },
  showToArtist: {
    be: 'Пакажы гэты вобраз майстру і',
    en: 'Show this look to the artist and',
  },
  madeBy: {
    be: 'створана neurokitsune і claude',
    en: 'created by neurokitsune and claude',
  },
  prev: { be: 'Папярэдні', en: 'Previous' },
  next: { be: 'Наступны', en: 'Next' },
  share: { be: 'Падзяліцца', en: 'Share' },
  sharing: { be: 'Рыхтуем…', en: 'Preparing…' },
  shareSaved: { be: 'Выява захавана', en: 'Image saved' },
  shareError: { be: 'Не атрымалася', en: 'Could not share' },
  shareText: {
    be: 'Мой вобраз з varushniak makeup',
    en: 'My look from varushniak makeup',
  },
  winInContest: { be: 'Выйграй 100 zł у нашай Гульні', en: 'Win 100 zł in our contest' },
  chancePrompt: { be: 'Я…', en: 'I am…' },
  chanceWoman: { be: 'Жанчына', en: 'Woman' },
  chanceMan: { be: 'Мужчына', en: 'Man' },
  chancePreferNot: { be: 'Не хачу казаць', en: 'Prefer not to say' },
  tryAgain: { be: 'Яшчэ раз', en: 'Try again' },
  randomName: { be: 'Выпадковы мэйк', en: 'Random makeup' },
  randomTagline: { be: 'Хай Купалле вырашыць', en: 'Let Kupalle decide' },
  contestName: { be: 'Выйграй 100 zł', en: 'Win 100 zł' },
  contestHeader: { be: 'Гульня', en: 'Contest' },
  contestTagline: { be: 'Дашлі сваё фота', en: 'Share your photo' },
  contestPrizeNote: {
    be: 'Падзяліся сваім купальскім вобразам і выйграй 100 zł',
    en: 'Share your Kupalle look and win 100 zł',
  },
  contestHow: { be: 'Як удзельнічаць:', en: 'How to enter:' },
  contestStep1: {
    be: 'Зрабі свой купальскі мейк у',
    en: 'Get your Kupalle makeup by',
  },
  contestStep2: {
    be: 'Апублікуй фота ў Instagram і адзнач',
    en: 'Post the photo on Instagram and tag',
  },
  contestStep3: { be: 'Пакінь', en: 'Leave' },
  contestStep3Tag: { be: 'свой нік у Instagram', en: 'your Instagram nickname' },
  contestStep3Or: { be: 'ці як цябе знайсці?', en: 'or how we can find you?' },
  contestInputLabel: { be: 'Твой нік у Instagram', en: 'Your Instagram nickname' },
  contestSubmit: { be: 'Удзельнічаць', en: 'Participate' },
  contestSuccess: {
    be: 'Ты ў розыгрышы! Поспехаў 🌿',
    en: "You're in the draw! Good luck 🌿",
  },
  contestWinnerNote: {
    be: 'Пераможцу абярэ выпадак пасля',
    en: 'Winner picked by random draw after',
  },
  contestEventName: { be: 'Варушняка', en: 'Varushniak' },
}

// Random toast phrases shown after the Chance gender pick.
export const TOAST_PHRASES: Record<'woman' | 'man', Loc[]> = {
  woman: [
    { be: 'Ты багіня, дзяўчынка', en: "You're a goddess, girl" },
    { be: 'Твая прысутнасць — асалода', en: 'Your presence is bliss' },
    {
      be: 'Ты выпраменьваеш упэўненасць і прыгажосць',
      en: 'You radiate confidence and beauty',
    },
    { be: 'Сёння ты — сапраўдная магія', en: 'You are pure magic tonight' },
    { be: 'Твая прыгажосць асвятляе Купалле', en: 'Your beauty lights up Kupalle' },
    { be: 'Ты ззяеш ярчэй за зоркі', en: 'You shine brighter than the stars' },
    { be: 'Ты смелая, вольная і дзікая', en: 'You are bold, wild and free' },
    { be: 'Гэтая ноч належыць табе', en: 'The night belongs to you' },
    { be: 'Ты — сіла прыроды', en: 'You are a force of nature' },
    { be: 'У табе жывуць грацыя і агонь', en: 'Grace and fire live in you' },
    { be: 'Ты проста незабыўная', en: 'You are simply unforgettable' },
  ],
  man: [
    { be: 'Найлепшай удачы', en: 'Best luck' },
    { be: 'Поспехаў', en: 'Good luck' },
    { be: 'Жадаю табе ўсяго найлепшага', en: 'Wish you the best' },
  ],
}

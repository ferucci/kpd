type Tstr = {
  [key: string]: string
}

export const EMAIL_REGULAR =
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g;
export const URL_REGULAR =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

export const MSG_ERROR: Tstr = {
  exists: "E11000",
  untf: "Пользователь не найден",
  pntf: "Страница не найдена",
  inc_data: "Переданы не верные значения",
  cntf: "Запрашиваемая карточка не найдена",
  srv: "На сервере произошла ошибка",
  wrEorP: "Неправильная почта или пароль",
  uExists: "Введенный email зарегистрирован в системе",
  unAuth: "Ошибка авторизации",
  // impossible to delete someone else's card
  impToDel: "Невозможно удалить чужую карточку",
  notAuth: "Авторизация не пройдена",
}

export const DEFAULT_VALUE: Tstr = {
  about: 'Пользователь пока ничего о себе не рассказал',
  avatar: 'https://lastfm.freetls.fastly.net/i/u/ar0/ef5be63dc666984e28185e96edec8b11.png',
  descWishlist: 'Дефолтное описание вишлиста'
}

export const LENGTH_OF_COLUMNS = {
  minUserNameLength: 2,
  maxUserNameLength: 30,
  minUserAboutLength: 2,
  maxUserAboutLength: 200,
  minPasswordLength: 6,
  minWishlistNameLength: 0,
  maxWishlistNameLength: 250,
  minWishlistDescLength: 0,
  maxWishlistDescLength: 1500,
  minWishDescLength: 1,
  maxWishDescLength: 1024,
  minWishNameLength: 1,
  maxWishNameLength: 250,
  minWishNumLength: 1,
  minWishCopiedLength: 0,
}
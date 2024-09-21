type S = {
  [key: string]: string;
};

interface N {
  [key: string]: number;
}

export enum MSG_ERROR {
  uExists = 'Введенный email или username зарегистрирован в системе',
  ontf = 'Объект не найден',
  inc_data = 'Переданы некорректные данные',
  cardHasOffered = 'Карточка уже предложена',
  editPrice = 'Невозможно изменить стоимость подарка, если уже есть желающие скинуться',
  impToDelProp = 'Невозможно удалить предложенный подарок',
  impToDelWish = 'Невозможно удалить чужой подарок',
  cntf = 'Запрашиваемый подарок не найден',
  rewriteWish = 'Подарок уже добавлен пользователю',
  impToDelWishlist = 'Вы не можете удалять чужие списки желаний',
  depositYourWish = 'Вносить средства на собственные желания запрещено',

  pntf = 'Страница не найдена',
  wrLorP = 'Неправильный логин или пароль',
  unAuth = 'Ошибка авторизации',
  notAuth = 'Авторизация не пройдена, проверьте введенные значения',
  ecopy = 'Ошибка в копировании',
  edel = 'Ошибка в удалении',
  eget = 'Ошибка в получении',
  ecreate = 'Ошибка в создании',
  eupdate = 'Ошибка при обновлении',
  err = 'Что-то пошло не так',
  amountIsMore = 'Сумма превышает максимальное значение, но я бы принял. Свяжитесь со мной)',
}

export enum ChekingEndingEntity {
  wish = 'подарков',
  wishlist = 'вишлистов',
  account = 'аккаунтов',
}

export const EMAIL_REGULAR = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g;
export const URL_REGULAR =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

export const VARS: N = {
  LIMIT_LAST_WISHES: 40,
  LIMIT_TOP_WISHES: 20,
};

export function editForbidden(message: string): string {
  return `Редактирование чужих ${message} запрещено`;
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
};

export const DEFAULT_VALUE: S = {
  about: 'Пользователь пока ничего о себе не рассказал',
  avatar:
    'https://lastfm.freetls.fastly.net/i/u/ar0/ef5be63dc666984e28185e96edec8b11.png',
  descWishlist: 'Дефолтное описание вишлиста',
  minLengthPass: `Минимальная длина пароля должна быть: ${LENGTH_OF_COLUMNS.minPasswordLength} символов`,
};

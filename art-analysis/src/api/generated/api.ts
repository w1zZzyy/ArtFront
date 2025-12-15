/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Обновление полей заявки (например, статус или результаты) */
export interface HandlerDTOReqCenterRequestUpd {
  /** @example 123.45 */
  center_x: number;
  /** @example 234.56 */
  center_y: number;
  /** @example "Calculate center" */
  request_description: string;
}

/** Данные для добавления нового эксперта */
export interface HandlerDTOReqExpertCreate {
  /** @example "luminosity_center" */
  algorithm: string;
  /** @example "Использует метод яркостного центра" */
  description?: string;
  /** @example "expert_photo.png" */
  img_url?: string;
  /** @example "Иванов И.И." */
  name: string;
  /** @example true */
  status?: boolean;
  /** @example "Центр композиционного анализа №1" */
  title: string;
}

/** Данные для регистрации нового пользователя */
export interface HandlerDTOReqUserReg {
  /** @example "art_user" */
  login: string;
  /** @example "secure_password_123" */
  password: string;
}

/** Данные для обновления пароля пользователя */
export interface HandlerDTOReqUserUpd {
  /** @example "new_secure_password" */
  password?: string;
}

/** Полная информация о заявке с экспертами */
export interface HandlerDTORespCenterRequest {
  /** @example "2025-11-07T12:00:00Z" */
  date_conclusion?: string;
  /** @example "2025-11-05T12:00:00Z" */
  date_created?: string;
  /** @example "2025-11-06T12:00:00Z" */
  date_formed?: string;
  /** @example "Art state calculation" */
  description?: string;
  experts?: HandlerDTORespCenterRequestExpert[];
  /** @example 0.51 */
  factor_x?: number;
  /** @example 0.48 */
  factor_y?: number;
  /** @example 5 */
  id_request?: number;
  /** @example 1 */
  id_user?: number;
  /** @example "formed" */
  request_status?: "draft" | "formed" | "completed" | "rejected";
}

/** Информация об эксперте внутри заявки */
export interface HandlerDTORespCenterRequestExpert {
  /** @example "force_lines" */
  algorithm?: string;
  /** @example 123.45 */
  center_x?: number;
  /** @example 234.56 */
  center_y?: number;
  /** @example 3 */
  id_artcenter?: number;
  /** @example 5 */
  id_request?: number;
  /** @example "Сидоров П.П." */
  name?: string;
  /** @example "Центр композиционного анализа №3" */
  title?: string;
}

/** Информация о связи между задачей и эксперта */
export interface HandlerDTORespCenterRequestExpertLink {
  /** @example 3 */
  id_artcenter?: number;
  /** @example 1 */
  id_request?: number;
}

/** Статистика по текущей задаче пользователя */
export interface HandlerDTORespCurrCenterRequestInfo {
  /** @example 3 */
  experts_count?: number;
  /** @example 5 */
  id_request?: number;
}

/** Полная информация об эксперте */
export interface HandlerDTORespExpert {
  /** @example "geometric_center" */
  algorithm?: string;
  /** @example "Определяет композиционный центр" */
  description?: string;
  /** @example 1 */
  id_artcenter?: number;
  /** @example "expert_photo.png" */
  img_url?: string;
  /** @example "Иванов И.И." */
  name?: string;
  /** @example true */
  status?: boolean;
  /** @example "Центр анализа №1" */
  title?: string;
}

/** Ответ, содержащий только идентификатор */
export interface HandlerDTORespSimpleID {
  /** @example 1 */
  id?: number;
}

/** JWT токен и данные пользователя */
export interface HandlerDTORespTokenLogin {
  /** @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." */
  token?: string;
  /** Информация о пользователе системы */
  user?: HandlerDTOUser;
}

/** Результат обновления центра */
export interface HandlerDTORespUpdate {
  /** @example 45.5 */
  center_x?: number;
  /** @example 45.5 */
  center_y?: number;
  /** @example 2 */
  expert_id?: number;
  /** @example 1 */
  request_id?: number;
}

/** Результат загрузки изображения для эксперта */
export interface HandlerDTORespUploadImg {
  /** @example 1 */
  id?: number;
  /** @example "expert_image.png" */
  image?: string;
}

/** Упрощенные данные пользователя */
export interface HandlerDTORespUser {
  /** @example "art_researcher" */
  login?: string;
}

/** Информация о пользователе системы */
export interface HandlerDTOUser {
  /** @example 1 */
  id_user?: number;
  /** @example false */
  is_admin?: boolean;
  /** @example "art_researcher" */
  login?: string;
}

export interface ModelArtExpert {
  algorithm?: string;
  description?: string;
  id_artcenter?: number;
  imgURL?: string;
  name?: string;
  orders?: ModelExpertsToRequest[];
  status?: boolean;
  title?: string;
}

export interface ModelCenterRequest {
  dateConclusion?: string;
  dateCreated?: string;
  dateFormed?: string;
  expertsLinks?: ModelExpertsToRequest[];
  factorX?: number;
  factorY?: number;
  id_creator?: number;
  id_moderator?: number;
  id_request?: number;
  moderator?: ModelUsers;
  requestDescription?: string;
  requestStatus?: string;
  user?: ModelUsers;
}

export interface ModelExpertsToRequest {
  artExpert?: ModelArtExpert;
  centerRequest?: ModelCenterRequest;
  /** @format float32 */
  centerX?: number;
  /** @format float32 */
  centerY?: number;
  id_artcenter?: number;
  id_request?: number;
}

export interface ModelUsers {
  id_user?: number;
  isModerator?: boolean;
  login?: string;
  password?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:8080";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Art Analysis API
 * @version 1.0
 * @license MIT (https://opensource.org/licenses/MIT)
 * @termsOfService http://swagger.io/terms/
 * @baseUrl http://localhost:8080
 * @contact API Support <support@swagger.io> (http://www.swagger.io/support)
 *
 * API для анализа композиционного центра произведений искусства
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Добавляет JWT токен в черный список и выполняет деавторизацию
     *
     * @tags Users
     * @name AuthLogoutCreate
     * @summary Выход из системы
     * @request POST:/api/auth/logout
     * @secure
     */
    authLogoutCreate: (params: RequestParams = {}) =>
      this.request<object, string>({
        path: `/api/auth/logout`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает список заявок. Пользователь видит только свои заявки, модератор — все заявки. Неавторизованный пользователь получает ошибку доступа.
     *
     * @tags CenterRequest
     * @name CenterRequestList
     * @summary Получить список заявок на анализ
     * @request GET:/api/center_request
     * @secure
     */
    centerRequestList: (
      query?: {
        /** Фильтр по статусу */
        status?: string;
        /** Начальная дата (фильтр от) */
        from?: string;
        /** Конечная дата (фильтр до) */
        to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerDTORespCenterRequest[], string>({
        path: `/api/center_request`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает ID текущего чернового заказа и количество добавленных экспертов.
     *
     * @tags CenterRequest
     * @name CenterRequestCurrentList
     * @summary Получить информацию о текущем черновом заказе
     * @request GET:/api/center_request/current
     */
    centerRequestCurrentList: (params: RequestParams = {}) =>
      this.request<HandlerDTORespCurrCenterRequestInfo, Record<string, string>>(
        {
          path: `/api/center_request/current`,
          method: "GET",
          format: "json",
          ...params,
        },
      ),

    /**
     * @description Возвращает детальную информацию о заявке на анализ по её идентификатору
     *
     * @tags CenterRequest
     * @name CenterRequestDetail
     * @summary Получить заявку по ID
     * @request GET:/api/center_request/{id}
     */
    centerRequestDetail: (id: number, params: RequestParams = {}) =>
      this.request<HandlerDTORespCenterRequest, string>({
        path: `/api/center_request/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет статус заявки и/или модератора, если это требуется
     *
     * @tags CenterRequest
     * @name CenterRequestUpdate
     * @summary Обновить заявку
     * @request PUT:/api/center_request/{id}
     */
    centerRequestUpdate: (
      id: number,
      request: HandlerDTOReqCenterRequestUpd,
      params: RequestParams = {},
    ) =>
      this.request<HandlerDTORespCenterRequest, string>({
        path: `/api/center_request/${id}`,
        method: "PUT",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Полностью удаляет заказ анализа произведения искусства
     *
     * @tags CenterRequest
     * @name CenterRequestDelete
     * @summary Удалить заказ на анализ
     * @request DELETE:/api/center_request/{id}
     */
    centerRequestDelete: (id: number, params: RequestParams = {}) =>
      this.request<HandlerDTORespSimpleID, string>({
        path: `/api/center_request/${id}`,
        method: "DELETE",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет координаты центра, переданные экспертом, в рамках заказа анализа
     *
     * @tags M-M
     * @name CenterRequestExpertsUpdate
     * @summary Обновить параметры эксперта
     * @request PUT:/api/center_request/{id}/experts/{expert_id}
     */
    centerRequestExpertsUpdate: (
      id: number,
      expertId: number,
      request: HandlerDTOReqCenterRequestUpd,
      params: RequestParams = {},
    ) =>
      this.request<HandlerDTORespUpdate, string>({
        path: `/api/center_request/${id}/experts/${expertId}`,
        method: "PUT",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет связь между экспертом и заказом анализа
     *
     * @tags M-M
     * @name CenterRequestExpertsDelete
     * @summary Удалить эксперта из заказа
     * @request DELETE:/api/center_request/{id}/experts/{expert_id}
     */
    centerRequestExpertsDelete: (
      id: number,
      expertId: number,
      params: RequestParams = {},
    ) =>
      this.request<HandlerDTORespCenterRequestExpertLink, string>({
        path: `/api/center_request/${id}/experts/${expertId}`,
        method: "DELETE",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Переводит заявку из статуса черновика в статус сформированной
     *
     * @tags CenterRequest
     * @name CenterRequestFormUpdate
     * @summary Сформировать заявку
     * @request PUT:/api/center_request/{id}/form
     */
    centerRequestFormUpdate: (id: number, params: RequestParams = {}) =>
      this.request<HandlerDTORespCenterRequest, string>({
        path: `/api/center_request/${id}/form`,
        method: "PUT",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Выполняет завершение или отклонение заявки по анализу произведения искусства. При завершении рассчитывается финальный композиционный центр.
     *
     * @tags CenterRequest
     * @name CenterRequestResolveUpdate
     * @summary Завершить/отклонить заявку
     * @request PUT:/api/center_request/{id}/resolve
     */
    centerRequestResolveUpdate: (
      id: number,
      request: object,
      params: RequestParams = {},
    ) =>
      this.request<HandlerDTORespCenterRequest, string>({
        path: `/api/center_request/${id}/resolve`,
        method: "PUT",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет указанного эксперта в текущий черновой заказ пользователя.
     *
     * @tags Experts
     * @name DraftExpertsCreate
     * @summary Добавить эксперта в черновик заявки
     * @request POST:/api/draft/experts/{id}
     */
    draftExpertsCreate: (id: number, params: RequestParams = {}) =>
      this.request<
        HandlerDTORespCenterRequestExpertLink,
        Record<string, string>
      >({
        path: `/api/draft/experts/${id}`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает список всех экспертов. Поддерживает фильтрацию по названию.
     *
     * @tags Experts
     * @name ExpertsList
     * @summary Получить список экспертов
     * @request GET:/api/experts
     */
    expertsList: (
      query?: {
        /** Фильтр по названию эксперта (подстрока) */
        title?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerDTORespExpert[], Record<string, string>>({
        path: `/api/experts`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создаёт нового эксперта с указанными атрибутами.
     *
     * @tags Experts
     * @name ExpertsCreate
     * @summary Создать нового эксперта
     * @request POST:/api/experts
     */
    expertsCreate: (
      expert: HandlerDTOReqExpertCreate,
      params: RequestParams = {},
    ) =>
      this.request<ModelArtExpert, Record<string, string>>({
        path: `/api/experts`,
        method: "POST",
        body: expert,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает полную информацию об эксперте по его идентификатору.
     *
     * @tags Experts
     * @name ExpertsDetail
     * @summary Получить эксперта по ID
     * @request GET:/api/experts/{id}
     */
    expertsDetail: (id: number, params: RequestParams = {}) =>
      this.request<ModelArtExpert, Record<string, string>>({
        path: `/api/experts/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет параметры существующего эксперта.
     *
     * @tags Experts
     * @name ExpertsUpdate
     * @summary Обновить эксперта
     * @request PUT:/api/experts/{id}
     */
    expertsUpdate: (
      id: number,
      expert: HandlerDTOReqExpertCreate,
      params: RequestParams = {},
    ) =>
      this.request<ModelArtExpert, Record<string, string>>({
        path: `/api/experts/${id}`,
        method: "PUT",
        body: expert,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Полностью удаляет эксперта по ID.
     *
     * @tags Experts
     * @name ExpertsDelete
     * @summary Удалить эксперта
     * @request DELETE:/api/experts/{id}
     */
    expertsDelete: (id: number, params: RequestParams = {}) =>
      this.request<HandlerDTORespSimpleID, Record<string, string>>({
        path: `/api/experts/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description Загружает изображение и сохраняет URL в базе данных.
     *
     * @tags Experts
     * @name ExpertsImageCreate
     * @summary Загрузить изображение эксперта
     * @request POST:/api/experts/{id}/image
     */
    expertsImageCreate: (
      id: number,
      data: {
        /** Изображение эксперта */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerDTORespUploadImg, Record<string, string>>({
        path: `/api/experts/${id}/image`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает данные аутентифицированного пользователя
     *
     * @tags Users
     * @name UsersMeList
     * @summary Получить текущего пользователя
     * @request GET:/api/users/me
     * @secure
     */
    usersMeList: (params: RequestParams = {}) =>
      this.request<HandlerDTORespUser, string>({
        path: `/api/users/me`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет пароль текущего аутентифицированного пользователя
     *
     * @tags Users
     * @name UsersMeUpdate
     * @summary Обновить данные пользователя
     * @request PUT:/api/users/me
     * @secure
     */
    usersMeUpdate: (
      request: HandlerDTOReqUserUpd,
      params: RequestParams = {},
    ) =>
      this.request<HandlerDTORespUser, string>({
        path: `/api/users/me`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  login = {
    /**
     * @description Выполняет вход пользователя и возвращает JWT токен
     *
     * @tags Users
     * @name LoginCreate
     * @summary Аутентификация пользователя
     * @request POST:/login
     */
    loginCreate: (request: HandlerDTOReqUserReg, params: RequestParams = {}) =>
      this.request<HandlerDTORespTokenLogin, string>({
        path: `/login`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Создает нового пользователя с указанными логином и паролем
     *
     * @tags Users
     * @name UsersCreate
     * @summary Регистрация пользователя
     * @request POST:/users
     */
    usersCreate: (request: HandlerDTOReqUserReg, params: RequestParams = {}) =>
      this.request<HandlerDTORespUser, string>({
        path: `/users`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}

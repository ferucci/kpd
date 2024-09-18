import { Wish } from "../wishes/entities/wishes.entity";

export interface IWishPaginator {
  data: Wish[];
  page: number;
  size: number;
  totalCount: number;
  totalPage: number;
}

export enum Role {
  USER = "user",
  ADMIN = "admin",
}
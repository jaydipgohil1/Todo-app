
export interface UserPayload {
  name?: string,
  email?: string,
  password?: string
}

export interface UserList {
  _id: String,
  name: String,
  email: String,
}

export interface UserUpdate {
  is_active?: Boolean,
}


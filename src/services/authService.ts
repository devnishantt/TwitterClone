import type { User } from "../generated/prisma/client";
import UserRepository from "../repositories/userRepository";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/common/tokenUtil";
import { ConflictError } from "../utils/errors/error";

interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName?: string | null;
  username: string;
  phone?: string | null;
}

interface AuthResponse {
  user: Partial<User>;
  accessToken: string;
  refreshToken: string;
}

export default class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData: UserRegistrationData): Promise<AuthResponse> {
    const { email, password, phone, firstName, lastName, username } = userData;

    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) throw new ConflictError("Email already in use.");

    const existingUsername = await this.userRepository.findByUsername(username);
    if (existingUsername) throw new ConflictError("Username already taken.");

    const user = await this.userRepository.create({ ...userData });

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    const refreshToken = generateRefreshToken({ id: user.id });

    await this.userRepository.saveRefreshToken(user.id, refreshToken);

    const { password: _, refreshToken: __, ...userDetails } = user;

    return { user: userDetails, accessToken, refreshToken };
  }
}

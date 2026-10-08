import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import express from 'express';
import { Public } from './types/auth.decorators';
import { TokenResponseDto } from './dto/token-response.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserDto } from '../users/dto/user.dto';
import { UsersMapper } from '../users/dto/users.mapper';
import type { AuthenticatedRequest } from './types/authenticated-request';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly usersMapper: UsersMapper,
  ) {}

  @Get('/me')
  @ApiOkResponse({
    type: UserDto,
  })
  getCurrentUser(@Req() request: AuthenticatedRequest): UserDto {
    return this.usersMapper.mapEntityToDto(request.user);
  }

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginRequestDto,
    @Res({ passthrough: true }) response: express.Response,
  ): Promise<void> {
    const tokens: TokenResponseDto = await this.service.login(loginDto);
    this.setTokenCookiesToResponse(
      response,
      tokens.accessToken,
      tokens.refreshToken,
    );
  }

  @Public()
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: express.Request,
    @Res({ passthrough: true }) response: express.Response,
  ): Promise<void> {
    const accessToken: string = await this.service.refreshAccessToken(
      request.headers.cookie,
    );
    this.setTokenCookiesToResponse(response, accessToken);
  }

  private setTokenCookiesToResponse(
    response: express.Response,
    accessToken: string,
    refreshToken?: string,
  ): void {
    response.cookie('access-token', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    if (refreshToken) {
      response.cookie('refresh-token', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 12 * 60 * 60 * 1000,
      });
    }
  }

  @Public()
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @Req() request: express.Request,
    @Res({ passthrough: true }) response: express.Response,
  ): void {
    this.service.revokeRefreshToken(request.headers.cookie);

    response.clearCookie('access-token');
    response.clearCookie('refresh-token');
  }
}

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuardJWT extends AuthGuard('jwt') { }

@Injectable()
export class AuthGuardLocal extends AuthGuard('local') { }
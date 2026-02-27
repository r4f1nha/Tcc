import { UserRole } from '../../../core/auth/models/user.model';

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface Team {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly memberCount: number;
  readonly tenantId: string;
  readonly createdAt: string;
}

export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
  readonly status: MemberStatus;
  readonly lastAccessAt: string | null;
  readonly teamIds: ReadonlyArray<string>;
  readonly avatarUrl: string | null;
}

export interface CreateUserPayload {
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
  readonly teamIds: ReadonlyArray<string>;
}

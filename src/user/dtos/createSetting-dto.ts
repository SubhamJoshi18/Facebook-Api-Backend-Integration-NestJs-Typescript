import { IsBoolean, IsOptional } from 'class-validator';

export class CreateSettingDto {
  @IsOptional()
  @IsBoolean({ message: 'Wrong Operation' })
  receivedNotifications?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Wrong Operations' })
  receivedEmail?: boolean;

  @IsOptional()
  active_status: boolean;
}

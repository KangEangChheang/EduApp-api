import { Module } from '@nestjs/common';
import { JwtHelper } from './jwt';


const modules = [
    JwtHelper
]


@Module({
  providers: modules,
  exports: modules,
})
export class HelperModule {}

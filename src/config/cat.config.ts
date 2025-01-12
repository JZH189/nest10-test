import { registerAs } from '@nestjs/config';

//带命名空间的配置
export default registerAs('cat', () => ({
  foo: 'bar',
}));

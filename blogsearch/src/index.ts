import SQLite, { Config } from './SQLite';

export default function blogsearch(config: Config) {
  return new SQLite(config).load();
}

import { createClient } from 'redis';


const client = createClient({ url: "rediss://red-ckk5tb66fcos73dricf0:xRoqn664c6ZZKcPd4JdldPVk1PGit9Q1@oregon-redis.render.com:6379" });
client.on('error', (err) => console.log('Redis Client Error', err));
(async () => await client.connect())();

export class Redis {
	public async setData(key: string, value: string, expiry: number = 3600) {
		await client.setEx(key, expiry, value);
	}

	public async getData(key: string) {
		const value = await client.get(key);
		return value;
	}

	public async deleteData(key: string) {
		await client.del(key);
	}

	public async flush() {
		await client.flushAll();
	}
}

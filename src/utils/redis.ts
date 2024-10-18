import { createClient } from 'redis';


const client = createClient({ url: "rediss://red-cq93bfjv2p9s73ccoka0:OrBDJ4Nm71ox0caqRwiEPfaP5XXh8Czy@oregon-redis.render.com:6379" });
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

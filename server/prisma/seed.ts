import { initDb, seedDb, seedEventHosts, seedEvents, seedParticipants, seedUsers } from '../src/utils/test-utils';

(async () => {
  await initDb();
  await seedDb();
})();

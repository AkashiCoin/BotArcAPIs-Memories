const TAG: string = 'arcapi.rank.me.ts';

import syslog from '../syslog/syslog';
import arcfetch, { ArcFetchRequest, ArcFetchMethod } from './arcfetch';
import IArcAccount from './interfaces/IArcAccount';

export default (account: IArcAccount, songid: string,
  difficulty: number, start: number = 4, limit: number = 18) => {

  return new Promise((resolve, reject) => {

    // construct remote request
    const _remote_request =
      new ArcFetchRequest(ArcFetchMethod.GET, 'score/song/me', {
        userToken: account.token,
        deviceId: account.device,
        submitData: new URLSearchParams({
          'song_id': songid,
          'difficulty': difficulty,
          'start': start,
          'limit': limit
        } as any)
      });

    // send request
    arcfetch(_remote_request)
      .then((root) => { resolve(root.value); })
      .catch((e) => {

        if (e == 'UnauthorizedError') {
          account.token = '';
          syslog.w(TAG, `Invalid token => ${account.name} ${account.token}`);
        }

        reject(e);

      });

  });

}

// import { ConfigService } from '../services/config.service';
// import { UserService } from '../services/user.service';
// import { map } from '../../../node_modules/rxjs/operators';
// import { Router } from '@angular/router';

// export function configurationFactory(
//   userService: UserService,
//   config: ConfigService,
//   router: Router
// ) {
//   console.log('im in configfactory');
//   config
//     .loadConfigurationData()
//     .pipe(
//       map(data => {
//         console.log('IM IN DATA CONFIG SERVICE', data);
//         userService.userId = data.body.userId;
//         userService.username = data.body.username;
//         router.navigate(['/feed/' + data.body.userId]);
//       })
//     )
//     .toPromise();
// }

// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportGitlab from '../../../app/controller/gitlab';
import ExportHome from '../../../app/controller/home';

declare module 'egg' {
  interface IController {
    gitlab: ExportGitlab;
    home: ExportHome;
  }
}

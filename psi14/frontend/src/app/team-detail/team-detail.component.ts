import {Component, OnInit, SimpleChanges} from '@angular/core';
import {Team} from "../models/team";
import {User} from "../models/user";
import {TeamService} from '../services/team.service';
import {ActivatedRoute} from '@angular/router';
import {UserService} from "../services/user.service";
import {Observable} from "rxjs";
import {Project} from "../models/project";
import {ProjectService} from "../services/project.service";


@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css']
})
export class TeamDetailComponent implements OnInit {

  isProjectSelected: boolean | undefined;
  team: Team;
  users: User[];
  selectedProj: Project | null;
  projects: Project[] = [];
  newUser: string;

  constructor(private teamService: TeamService,
              private projectService: ProjectService,
              private userService: UserService,
              private route: ActivatedRoute) {
    this.users = [];
    this.selectedProj = null;
    this.team = {_id: "1", name: "", users: [], project: ""}
    this.isProjectSelected = this.team.project != "";
    this.newUser = "";

  }

  ngOnInit(): void {
    this.getTeamDetails();
    this.teamService.Refreshrequired.subscribe(response => {
      this.getTeamDetails();
    })
  }

  getTeamDetails(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.teamService.getTeam(id)
      .subscribe(team => {
        this.team = team;
        if (this.team.project != null) {
          this.getProject(this.team.project)
        }
        this.updateUsers();
        this.verifyProjectSelected();
      });
    this.getProjects();
  }

  getProjects(): void {
    this.projectService.getAvailableProjects().subscribe(projects => this.projects = projects);
  }

  getProject(projectId: string): void {
    if(projectId == null){
      return;
    }
    this.projectService.getProject(projectId)
      .subscribe(newProject => {
        this.selectedProj = newProject;
      });
  }

  verifyProjectSelected(): void {
    this.isProjectSelected = this.team.project != null;
  }

  updateUsers(): void {
    this.users = [];
    this.team?.users.forEach(user => this.userService.getUser(String(user))
      .subscribe(userWithName => this.users?.push({_id: userWithName._id, name: userWithName.name})));
  }




  selectOption(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.teamService.addProjectTeam(this.selectedProj, id).subscribe((team) => {
      this.getProject(team.project);
    });
  }

  cleanOption(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.teamService.removeProjectTeam(this.selectedProj, id).subscribe();
    this.isProjectSelected = false;
    this.selectedProj = null
  }

  addUserToTeam = (args: any): void => {
    if (!args) {
      return;
    }

    const id = this.route.snapshot.paramMap.get('id')!;
    this.teamService.addUserToTeam(args, id)
      .subscribe(team => {
      });
  }

  removeUser(user: any): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.teamService.removeUserToTeam(user._id, id)
      .subscribe(team => {
      });
  }

}

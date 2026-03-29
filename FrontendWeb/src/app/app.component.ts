import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InfoService } from '../features/info.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  public backendVersion: string = "";

  constructor(
    private infoService: InfoService
  ) {}

  ngOnInit() {
    this.infoService.getInfo().subscribe({
      next: (data) => {
        console.log("App/Info: OK");
        this.backendVersion = data.version;
        console.log(this.backendVersion);
      },
      error: (error) => {
        console.log("App/Info: ERROR");
        console.log(error);
      }
    });
  }

}

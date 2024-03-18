import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';
import * as moment from 'moment';
import { TaskService } from '../services/task.service';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  form!: FormGroup;
  constructor(private fb: FormBuilder, public notificationService: NotificationService, private taskService: TaskService, private router: Router, private authService: AuthService,) { }

  toDoList: any[] = [];
  taskList: any[] = [];
  editTask!: any

  inProgressList: any[] = [];
  doneList: any[] = [];
  minDate = moment(new Date()).format('YYYY-MM-DD')

  ngOnInit(): void {
    this.initForm();
    this.getTaskList()
  }

  initForm() {
    this.form = this.fb.group(
      {
        title: ['', Validators.required],
        date: [moment(new Date()).format('YYYY-MM-DD'), Validators.required]
      }
    );
  }


  trash(list: any[], index: any, item: any) {
    list.splice(index, 1);
    console.log('list', list, index);
    this.taskService.deleteTask(item._id).subscribe(task => {
      if (!task.data) return
      this.getTaskList()
      this.notificationService.showSuccess('Task Deleted Successfully!');
      this.initForm();
    })
  }

  edit(item: any) {
    this.editTask = item;
    this.form = this.fb.group(
      {
        title: [item.title, Validators.required],
        date: [moment(new Date(item.date)).format('YYYY-MM-DD'), Validators.required]
      }
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const droppedItem: any = event.previousContainer.data[event.previousIndex];
      const droppedIntoContainerId = event.container.id; // Get the ID of the container where the item was dropped
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (droppedItem) {
        droppedItem.stage = droppedIntoContainerId === "cdk-drop-list-0" ? 0 : (droppedIntoContainerId === "cdk-drop-list-1" ? 1 : 2)
        this.taskService.updateTask(droppedItem._id, droppedItem).subscribe(task => {
          if (!task.data) return;
          this.getTaskList()
        })
      }

    }
  }

  getTaskList() {
    this.taskService.getTaskList().subscribe(task => {
      if (!task.data) return
      this.taskList = task.data;
      this.filterData();
    })
  }

  filterData() {
    this.toDoList = [];
    this.inProgressList = [];
    this.doneList = []
    this.taskList.map((task) => {
      if (task.stage === 0)
        this.toDoList.push(task)
      else if (task.stage === 1)
        this.inProgressList.push(task)
      else
        this.doneList.push(task)
    })
  }

  onSubmit() {
    if (!this.form.valid) return
    if (this.editTask?._id) {
      const payload = {
        ...this.editTask,
        ...this.form.value,
      }
      this.taskService.updateTask(this.editTask._id, payload).subscribe(task => {
        if (!task.data) return
        this.getTaskList()
        this.notificationService.showSuccess('Task Updated Successfully!');
        this.initForm();
        this.editTask = null;
      })
    }
    else
      this.taskService.addTask(this.form.value).subscribe(task => {
        if (!task.data) return
        this.getTaskList()
        this.notificationService.showSuccess('Task Added Successfully!');
        this.initForm();
      })
  }
}

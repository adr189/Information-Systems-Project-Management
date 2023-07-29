var express = require('express');
const userController = require("../controllers/userController");
const authenticationController = require("../controllers/authenticationController");
const projectController = require("../controllers/projectController");
var router = express.Router();
var teamController = require("../controllers/teamController");
var taskController = require("../controllers/taskController");



var task_controller = require('../controllers/taskController');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

//authentication
router.post('/auth', authenticationController.authentication);

//teams
router.get('/team/:id', teamController.team_detail);
router.put('/team/:id/add/user', teamController.add_user_team);
router.put('/team/:id/remove/user', teamController.remove_user_team);
router.put('/team/:id/add', teamController.team_add_project);
router.put('/team/:id/remove', teamController.team_remove_project);
router.get('/team', teamController.exists_team_with_name);


router.get('/teams', teamController.team_list);
router.get('/teams/:id', teamController.team_list_from_user);
router.post('/teams', teamController.team_create);

//users
router.get('/user/:id', userController.user_detail);
router.get('/users', userController.users_list);
router.get('/user', userController.exists_user_with_name);
router.post('/user', userController.user_create);
router.post('/user/meeting/add', userController.add_meeting);
router.get('/user/meetings/:id', userController.get_meetings);



//projects
router.get('/projects', projectController.projects_list);
router.get('/projects/available', projectController.projects_list_available);
router.post('/projects', projectController.project_create);
router.get('/projects', projectController.projects_list);
router.get('/project/:id', projectController.project_get);
router.get('/project', projectController.exists_project_with_acronym);



//tasks
router.get('/tasks/:id', taskController.task_list);
router.post('/tasks', taskController.task_create);
router.delete('/tasks/:id', taskController.task_delete);
router.get('/task/:id', task_controller.task_detail);
router.put('/task/:id', task_controller.task_update_project);
router.put('/task/:id/percentage', task_controller.task_update_percentage);
router.put('/task/:id/info', task_controller.task_update_dates_and_percentage);
router.put('/task/:id/add/user', task_controller.add_user_task);
router.put('/task/:id/remove/user', task_controller.remove_user_task);
router.put('/task/:id/update/begin_date', task_controller.update_begin_date);
router.put('/task/:id/update/end_date', task_controller.update_end_date);




module.exports = router;
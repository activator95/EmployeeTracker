INSERT INTO department(department_name)
VALUES("Engineering"), ("Design"), ("Production"), ("Media"), ("Marketing");

INSERT INTO role(title, salary, department_id)
VALUES("President", 355000, 1), ("Designer", 265000, 2), ("Senior Designer", 300000, 2), 
      ("Intern", 60000, 2), ("Consultant", 85000, 5), ("Press", 95000, 6), ("Temp", 62000, 7);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Marina', 'Walker', 1, null), ('Josh', 'Bunting', 1, null), ('Tommy', 'Williums', 2, 1), ('Jorge', 'Jackson', 2, 1), ('Don', 'Bills', 4, null);

-- here is the order and the ids for each role for this project president = role_id # 1   designer = role_id # 2  senior designer = role_id # 3  intern = role_id # 4 consultant = role_id # 5 press = role_id # 6 temp = role_id # 7 
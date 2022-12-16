INSERT INTO department (name)
VALUES ('Operations'),
       ('Finance'),
       ('HR'),
       ('Marketing');

INSERT INTO role (title, salary, department_id)
VALUES ('Finance - Manager', 100000, 2),
       ('Finance - Associate', 60000, 2),
       ('HR - Manager', 90000, 3),
       ('Marketing - Manager', 120000, 4),
       ('Operations - Manager', 100000, 1),
       ('Operations - Associate', 60000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('River', 'W', 1, null),
       ('Olive', 'F', 2, 1),
       ('Winter', 'B', 3, null),
       ('Robin', 'B', 5, null),
       ('April', 'S', 6, 4);
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { hash } from "../src/auth/utils/security";
import {
  EmployeeRole,
  EmployeeRoleType,
} from "../src/employee-roles/entities/employee-role.entity";
import {
  ActivityType,
  FlowActivity,
} from "../src/flow-activities/entities/flow-activity.entity";
import { Role, RoleType } from "../src/roles/entities";
import { User } from "../src/users";

export class InitialSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    console.log("Running Initial Seeder...");

    const flowActivityRepo = dataSource.getRepository(FlowActivity);
    let activityTypes: Partial<FlowActivity>[] = [
      {
        name: "Voice",
        type: ActivityType.voice,
      },
      {
        name: "Email",
        type: ActivityType.email,
      },
      {
        name: "SMS",
        type: ActivityType.sms,
      },
      {
        name: "Task",
        type: ActivityType.task,
      },
      {
        name: "Webhook",
        type: ActivityType.webhook,
      },
    ];
    const existingActivities = await flowActivityRepo.find();
    existingActivities.forEach((activity) => {
      activityTypes = activityTypes.filter((at) => at.type !== activity.type);
    });

    if (activityTypes.length !== 0) await flowActivityRepo.save(activityTypes);

    const roleRepo = dataSource.getRepository(Role);

    let roles: Partial<Role>[] = [
      { name: "Super Admin", type: RoleType.SUPER_ADMIN },
      { name: "Administrator", type: RoleType.ADMIN },
      { name: "Employee", type: RoleType.EMPLOYEE },
      { name: "Client", type: RoleType.CLIENT },
      { name: "User", type: RoleType.USER },
    ];

    const existingRoles = await roleRepo.find();
    existingRoles.forEach((role) => {
      roles = roles.filter((r) => r.type !== role.type);
    });

    if (roles.length !== 0) await roleRepo.save(roles);

    const employeeRoleRepo = dataSource.getRepository(EmployeeRole);

    let employeeRoles: Partial<EmployeeRole>[] = [
      { name: "Agent", type: EmployeeRoleType.AGENT },
      { name: "Developer", type: EmployeeRoleType.DEVELOPER },
      { name: "Lead", type: EmployeeRoleType.LEAD },
      { name: "Manager", type: EmployeeRoleType.MANAGER },
    ];

    const existingEmployeeRoles = await employeeRoleRepo.find();
    existingEmployeeRoles.forEach((role) => {
      employeeRoles = employeeRoles.filter((r) => r.type !== role.type);
    });

    if (employeeRoles.length !== 0) await employeeRoleRepo.save(employeeRoles);

    const userRepo = dataSource.getRepository(User);

    const superAdmin = await userRepo.findOne({
      where: { email: "admin@admin.com" },
    });

    if (!superAdmin) {
      const adminRole = await roleRepo.findOne({
        where: { type: RoleType.SUPER_ADMIN },
      });

      const newAdmin = userRepo.create({
        email: "admin@admin.com",
        password: await hash("Admin@12345"),
        firstName: "Super",
        lastName: "Admin",
        roles: adminRole ? [adminRole] : [],
      });

      await userRepo.save(newAdmin);
    }
  }
}

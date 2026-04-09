import List "mo:core/List";
import AccessControl "lib/access-control";
import AuthorizationMixin "mixins/authorization-api";
import StudentsMixin "mixins/students-api";
import Types "types/students";
import Migration "migration";

(with migration = Migration.run)
actor {
  let authState = AccessControl.initState();
  include AuthorizationMixin(authState);

  let students = List.empty<Types.Student>();
  let nextStudentId = { var value : Nat = 0 };

  include StudentsMixin(authState, students, nextStudentId);
};

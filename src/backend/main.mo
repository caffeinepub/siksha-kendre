import List "mo:core/List";
import AccessControl "lib/access-control";
import AuthorizationMixin "mixins/authorization-api";
import StudentsMixin "mixins/students-api";
import Types "types/students";

actor {
  let accessControlState = AccessControl.initState();
  include AuthorizationMixin(accessControlState);

  let students = List.empty<Types.Student>();
  let nextStudentId = { var value : Nat = 0 };

  include StudentsMixin(accessControlState, students, nextStudentId);
};

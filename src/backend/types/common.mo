module {
  public type StudentId = Nat;
  public type Timestamp = Int;

  public type PaymentStatus = {
    #Paid;
    #Pending;
  };

  public type PaymentMethod = {
    #UPI;
    #Cash;
  };

  public type StudentClass = {
    #Nursery;
    #Class1;
    #Class2;
    #Class3;
    #Class4;
    #Class5;
  };

  // Auth types
  public type UserRole = {
    #admin;
    #staff;
  };

  public type UserAccount = {
    username : Text;
    var passwordHash : Text;
    role : UserRole;
  };

  public type SessionInfo = {
    username : Text;
    role : UserRole;
  };

  public type AuthResult = {
    #ok : Text; // session token
    #err : Text; // error message
  };

  public type StaffInfo = {
    username : Text;
    role : UserRole;
  };
};

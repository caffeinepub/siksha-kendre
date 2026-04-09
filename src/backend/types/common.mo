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
};

using BungieCordBlogWebAPI.Models.Domain;

/*
    Design Decision: Payment-Related Repository Interfaces in a Single File

    For this student learning project, I am keeping the repository interfaces for all payment-related tables 
    (OrderBasket, OrderBasketItem, Payment, Order, OrderItem) in a single file. 
    Each table still has its own interface, maintaining separation of concerns and clear contract boundaries.

    Rationale:
    - This approach makes it easier to find and manage all payment-related data access logic in one place.
    - It helps reinforce the relationships and flow between basket, order, and payment entities for learning purposes.
    - For a real-world, production-grade application, it is best practice to keep each interface in its own file 
      for maintainability, scalability, and clarity.
    - However, grouping them here can help students see the bigger picture and understand how these components 
      interact in a payment flow.

    Additional Note:
    - Keeping related interfaces together can be useful in small projects or prototypes, especially when the 
      domain is tightly scoped and the team is small.
    - As the project grows, consider refactoring to separate files and possibly using more advanced patterns 
      (such as generic repositories or service layers).

    Summary:
    - This is a conscious trade-off for educational clarity and convenience.
    - The code remains organized by interface, but grouped for easier navigation and learning.
*/

public interface IPaymentRepository
{
    // OrderBasket CRUD
    Task<OrderBasket?> GetOrderBasketByIdAsync(Guid id);
    Task<IEnumerable<OrderBasket>> GetAllOrderBasketsAsync();
    Task<OrderBasket> AddOrderBasketAsync(OrderBasket basket);
    Task<OrderBasket?> UpdateOrderBasketAsync(Guid id, OrderBasket basket);
    Task<bool> DeleteOrderBasketAsync(Guid id);

    // OrderBasketItem CRUD
    Task<OrderBasketItem?> GetOrderBasketItemByIdAsync(Guid id);
    Task<IEnumerable<OrderBasketItem>> GetOrderBasketItemsByBasketIdAsync(Guid basketId);
    Task<OrderBasketItem> AddOrderBasketItemAsync(OrderBasketItem item);
    Task<OrderBasketItem?> UpdateOrderBasketItemAsync(Guid id, OrderBasketItem item);
    Task<bool> DeleteOrderBasketItemAsync(Guid id);

    // Payment CRUD
    Task<Payment?> GetPaymentByIdAsync(Guid id);
    Task<IEnumerable<Payment>> GetAllPaymentsAsync();
    Task<Payment> AddPaymentAsync(Payment payment);
    Task<Payment?> UpdatePaymentAsync(Guid id, Payment payment);
    Task<bool> DeletePaymentAsync(Guid id);

    // Order CRUD
    Task<Order?> GetOrderByIdAsync(Guid id);
    Task<IEnumerable<Order>> GetAllOrdersAsync();
    Task<Order> AddOrderAsync(Order order);
    Task<Order?> UpdateOrderAsync(Guid id, Order order);
    Task<bool> DeleteOrderAsync(Guid id);

    // OrderItem CRUD
    Task<OrderItem?> GetOrderItemByIdAsync(Guid id);
    Task<IEnumerable<OrderItem>> GetOrderItemsByOrderIdAsync(Guid orderId);
    Task<OrderItem> AddOrderItemAsync(OrderItem item);
    Task<OrderItem?> UpdateOrderItemAsync(Guid id, OrderItem item);
    Task<bool> DeleteOrderItemAsync(Guid id);

    //User related operations
    Task<bool> UserHasBasketAsync(Guid userGuid);
    Task CreateBasketForUserAsync(Guid userGuid);
    Task<OrderBasket> GetOrderBasketByuserGuidIdAsync(Guid userGuid);


}
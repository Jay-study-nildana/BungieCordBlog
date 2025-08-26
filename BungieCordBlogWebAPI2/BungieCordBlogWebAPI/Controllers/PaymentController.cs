using BungieCordBlogWebAPI.Models.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

//Tables used in this controller. 

//public DbSet<OrderBasket> OrderBaskets { get; set; }
//public DbSet<OrderBasketItem> OrderBasketItems { get; set; }
//public DbSet<Order> Orders { get; set; }
//public DbSet<OrderItem> OrderItems { get; set; }
//public DbSet<Payment> Payments { get; set; }

namespace BungieCordBlogWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentRepository paymentRepository;

        public PaymentController(IPaymentRepository paymentRepository)
        {
            this.paymentRepository = paymentRepository;
        }

        // GET: api/payment/orderbasket/{id}
        [HttpGet("orderbasket/{id:guid}")]
        public async Task<IActionResult> GetOrderBasketById(Guid id)
        {
            var basket = await paymentRepository.GetOrderBasketByIdAsync(id);
            if (basket == null) return NotFound();

            var items = basket.Items?.Select(i => new OrderBasketItemDto
            {
                Id = i.Id,
                OrderBasketId = i.OrderBasketId,
                ProductId = i.ProductId,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                AddedDate = i.AddedDate
            }).ToList() ?? new List<OrderBasketItemDto>();

            // Add a dummy item if the list is empty
            if (!items.Any())
            {
                items.Add(new OrderBasketItemDto
                {
                    Id = Guid.Empty,
                    OrderBasketId = basket.Id,
                    ProductId = Guid.Empty,
                    Quantity = 0,
                    UnitPrice = 0,
                    AddedDate = DateTime.MinValue
                });
            }

            var dto = new OrderBasketDto
            {
                Id = basket.Id,
                UserId = basket.UserId,
                CreatedDate = basket.CreatedDate,
                UpdatedDate = basket.UpdatedDate,
                Items = items
            };

            return Ok(dto);
        }

        // GET: api/payment/orderbasket/by-user/{userId}
        [HttpGet("orderbasket/by-user/{userId:guid}")]
        public async Task<IActionResult> GetOrderBasketByUserId(Guid userId)
        {
            var basket = await paymentRepository.GetOrderBasketByuserGuidIdAsync(userId);
            if (basket == null) return NotFound();

            var items = basket.Items?.Select(i => new OrderBasketItemDto
            {
                Id = i.Id,
                OrderBasketId = i.OrderBasketId,
                ProductId = i.ProductId,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                AddedDate = i.AddedDate
            }).ToList() ?? new List<OrderBasketItemDto>();

            // Add a dummy item if the list is empty
            if (!items.Any())
            {
                items.Add(new OrderBasketItemDto
                {
                    Id = Guid.Empty,
                    OrderBasketId = basket.Id,
                    ProductId = Guid.Empty,
                    Quantity = 0,
                    UnitPrice = 0,
                    AddedDate = DateTime.MinValue
                });
            }

            var dto = new OrderBasketDto
            {
                Id = basket.Id,
                UserId = basket.UserId,
                CreatedDate = basket.CreatedDate,
                UpdatedDate = basket.UpdatedDate,
                Items = items
            };

            return Ok(dto);
        }

        // GET: api/payment/orderbaskets
        [HttpGet("orderbaskets")]
        public async Task<IActionResult> GetAllOrderBaskets()
        {
            var baskets = await paymentRepository.GetAllOrderBasketsAsync();
            var dtos = baskets.Select(basket => new OrderBasketDto
            {
                Id = basket.Id,
                UserId = basket.UserId,
                CreatedDate = basket.CreatedDate,
                UpdatedDate = basket.UpdatedDate,
                Items = basket.Items?.Select(i => new OrderBasketItemDto
                {
                    Id = i.Id,
                    OrderBasketId = i.OrderBasketId,
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    AddedDate = i.AddedDate
                }).ToList() ?? new()
            }).ToList();

            return Ok(dtos);
        }

        // POST: api/payment/orderbasket
        [HttpPost("orderbasket")]
        public async Task<IActionResult> AddOrderBasket([FromBody] CreateOrderBasketDto dto)
        {
            var basket = new OrderBasket
            {
                UserId = dto.UserId,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };

            var created = await paymentRepository.AddOrderBasketAsync(basket);

            var resultDto = new OrderBasketDto
            {
                Id = created.Id,
                UserId = created.UserId,
                CreatedDate = created.CreatedDate,
                UpdatedDate = created.UpdatedDate,
                Items = new()
            };

            return CreatedAtAction(nameof(GetOrderBasketById), new { id = resultDto.Id }, resultDto);
        }

        // PUT: api/payment/orderbasket/{id}
        [HttpPut("orderbasket/{id:guid}")]
        public async Task<IActionResult> UpdateOrderBasket(Guid id, [FromBody] UpdateOrderBasketDto dto)
        {
            var basket = new OrderBasket
            {
                UserId = dto.UserId,
                UpdatedDate = DateTime.UtcNow
            };

            var updated = await paymentRepository.UpdateOrderBasketAsync(id, basket);
            if (updated == null) return NotFound();

            var resultDto = new OrderBasketDto
            {
                Id = updated.Id,
                UserId = updated.UserId,
                CreatedDate = updated.CreatedDate,
                UpdatedDate = updated.UpdatedDate,
                Items = updated.Items?.Select(i => new OrderBasketItemDto
                {
                    Id = i.Id,
                    OrderBasketId = i.OrderBasketId,
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    AddedDate = i.AddedDate
                }).ToList() ?? new()
            };

            return Ok(resultDto);
        }

        // DELETE: api/payment/orderbasket/{id}
        [HttpDelete("orderbasket/{id:guid}")]
        public async Task<IActionResult> DeleteOrderBasket(Guid id)
        {
            var deleted = await paymentRepository.DeleteOrderBasketAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // GET: api/payment/orderbasketitem/{id}
        [HttpGet("orderbasketitem/{id:guid}")]
        public async Task<IActionResult> GetOrderBasketItemById(Guid id)
        {
            var item = await paymentRepository.GetOrderBasketItemByIdAsync(id);
            if (item == null) return NotFound();

            var dto = new OrderBasketItemDto
            {
                Id = item.Id,
                OrderBasketId = item.OrderBasketId,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                AddedDate = item.AddedDate
            };

            return Ok(dto);
        }

        // GET: api/payment/orderbasketitems/{basketId}
        [HttpGet("orderbasketitems/{basketId:guid}")]
        public async Task<IActionResult> GetOrderBasketItemsByBasketId(Guid basketId)
        {
            var items = await paymentRepository.GetOrderBasketItemsByBasketIdAsync(basketId);
            var dtos = items.Select(item => new OrderBasketItemDto
            {
                Id = item.Id,
                OrderBasketId = item.OrderBasketId,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                AddedDate = item.AddedDate
            }).ToList();

            return Ok(dtos);
        }

        // POST: api/payment/orderbasketitem
        [HttpPost("orderbasketitem")]
        public async Task<IActionResult> AddOrderBasketItem([FromBody] CreateOrderBasketItemDto dto)
        {
            var item = new OrderBasketItem
            {
                OrderBasketId = dto.OrderBasketId,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                UnitPrice = dto.UnitPrice,
                AddedDate = DateTime.UtcNow
            };

            var created = await paymentRepository.AddOrderBasketItemAsync(item);

            var resultDto = new OrderBasketItemDto
            {
                Id = created.Id,
                OrderBasketId = created.OrderBasketId,
                ProductId = created.ProductId,
                Quantity = created.Quantity,
                UnitPrice = created.UnitPrice,
                AddedDate = created.AddedDate
            };

            return CreatedAtAction(nameof(GetOrderBasketItemById), new { id = resultDto.Id }, resultDto);
        }

        // PUT: api/payment/orderbasketitem/{id}
        [HttpPut("orderbasketitem/{id:guid}")]
        public async Task<IActionResult> UpdateOrderBasketItem(Guid id, [FromBody] UpdateOrderBasketItemDto dto)
        {
            var item = new OrderBasketItem
            {
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                UnitPrice = dto.UnitPrice
            };

            var updated = await paymentRepository.UpdateOrderBasketItemAsync(id, item);
            if (updated == null) return NotFound();

            var resultDto = new OrderBasketItemDto
            {
                Id = updated.Id,
                OrderBasketId = updated.OrderBasketId,
                ProductId = updated.ProductId,
                Quantity = updated.Quantity,
                UnitPrice = updated.UnitPrice,
                AddedDate = updated.AddedDate
            };

            return Ok(resultDto);
        }

        // DELETE: api/payment/orderbasketitem/{id}
        [HttpDelete("orderbasketitem/{id:guid}")]
        public async Task<IActionResult> DeleteOrderBasketItem(Guid id)
        {
            var deleted = await paymentRepository.DeleteOrderBasketItemAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        [HttpPost("complete-order")]
        [Authorize]
        public async Task<IActionResult> CompleteOrder(Guid UserId,Guid PaymentId)
        {

            //get all the items from the order basket
            var basketId = (await paymentRepository.GetOrderBasketByuserGuidIdAsync(UserId))?.Id;

            IEnumerable<OrderBasketItem> listofitems = await paymentRepository.GetOrderBasketItemsByBasketIdAsync((Guid)basketId);

            //check if basket is empty

            if (!listofitems.Any())
            {
                return BadRequest("Order basket is empty.");
            }

            // Create the order
            var order = new Order
            {
                UserId = UserId,
                PaymentId = PaymentId,
                Status = OrderStatus.Processing,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };

            var createdOrder = await paymentRepository.AddOrderAsync(order);



            // Copy all basket items to orderItems as DTOs
            var orderItems = new List<OrderItemDto>(); ;
            foreach (var basketItem in listofitems)
            {
                var orderItem = new OrderItem
                {
                    OrderId = createdOrder.Id,
                    ProductId = basketItem.ProductId,
                    Quantity = basketItem.Quantity,
                    UnitPrice = basketItem.UnitPrice
                };

                var createdOrderItem = await paymentRepository.AddOrderItemAsync(orderItem);

                orderItems.Add(new OrderItemDto
                {
                    Id = createdOrderItem.Id,
                    OrderId = createdOrderItem.OrderId,
                    ProductId = createdOrderItem.ProductId,
                    Quantity = createdOrderItem.Quantity,
                    UnitPrice = createdOrderItem.UnitPrice
                });
            }

            //go through each item in the listofitems and delete them from the order basket

            foreach (var basketItem in listofitems)
            {
                await paymentRepository.DeleteOrderBasketItemAsync(basketItem.Id);
            }            

            // Prepare response DTO
            var responseDto = new OrderDto
            {
                Id = createdOrder.Id,
                UserId = createdOrder.UserId,
                PaymentId = createdOrder.PaymentId,
                Status = createdOrder.Status,
                CreatedDate = createdOrder.CreatedDate,
                UpdatedDate = createdOrder.UpdatedDate,
                Items = orderItems
            };

            return Ok(responseDto);
        }

        [HttpPost("payment")]
        public async Task<IActionResult> AddPayment([FromBody] CreatePaymentDto dto)
        {

            var tempTransactionId = Guid.NewGuid().ToString(); // Simulate a transaction ID from a payment gateway  
            tempTransactionId = tempTransactionId+"-"+ DateTime.UtcNow.Ticks.ToString(); // Make it more unique by appending ticks
            var payment = new Payment
            {
                UserId = dto.UserId,
                Amount = dto.Amount,
                Method = dto.Method,
                Status = dto.Status,
                TransactionId = tempTransactionId,
                CreatedDate = DateTime.UtcNow
            };

            var created = await paymentRepository.AddPaymentAsync(payment);

            var resultDto = new PaymentDto
            {
                Id = created.Id,
                UserId = created.UserId,
                Amount = created.Amount,
                Method = created.Method,
                Status = created.Status,
                TransactionId = created.TransactionId,
                CreatedDate = created.CreatedDate
            };

            return CreatedAtAction(nameof(AddPayment), new { id = resultDto.Id }, resultDto);
        }



        public class OrderItemDto
        {
            public Guid Id { get; set; }
            public Guid OrderId { get; set; }
            public Guid ProductId { get; set; }
            public int Quantity { get; set; }
            public decimal UnitPrice { get; set; }
        }

        public class OrderDto
        {
            public Guid Id { get; set; }
            public Guid UserId { get; set; }
            public Guid PaymentId { get; set; }
            public OrderStatus Status { get; set; }
            public DateTime CreatedDate { get; set; }
            public DateTime UpdatedDate { get; set; }
            public List<OrderItemDto> Items { get; set; }
        }

        public class CreatePaymentDto
        {
            public Guid UserId { get; set; }
            public decimal Amount { get; set; }
            public string Method { get; set; }
            public PaymentStatus Status { get; set; }
            public string TransactionId { get; set; }
        }

        public class PaymentDto
        {
            public Guid Id { get; set; }
            public Guid UserId { get; set; }
            public decimal Amount { get; set; }
            public string Method { get; set; }
            public PaymentStatus Status { get; set; }
            public string TransactionId { get; set; }
            public DateTime CreatedDate { get; set; }
        }
    }


}

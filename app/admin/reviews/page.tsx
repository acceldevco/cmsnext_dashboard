"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  approved: boolean;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [open, setOpen] = useState(false);
  const [editedReview, setEditedReview] = useState<Review | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [page, pageSize]);

  const fetchReviews = async () => {
    const res = await fetch(`/api/review?page=${page}&pageSize=${pageSize}`);
    const reviewsData = await res.json();
    setReviews(reviewsData.reviews);
    setTotalCount(reviewsData.totalCount);
  };

  const handleEdit = (review: Review) => {
    setEditedReview(review);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/review/${id}`, {
      method: "DELETE",
    });
    setReviews(reviews.filter((review) => review.id !== id));
  };

  const handleAdd = () => {
    setAddOpen(true);
  };

  const handleSave = async (review: Review) => {
    await fetch(`/api/review/${review.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });
    setReviews(reviews.map((r) => (r.id === review.id ? review : r)));
    setOpen(false);
  };

  const handleCreate = async (newReview: Omit<Review, "id">) => {
    const response = await fetch("/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReview),
    });

    if (response.ok) {
      fetchReviews();
      setAddOpen(false);
    }
  };

  return (
    <ContentLayout title="Reviews">
      <Button onClick={handleAdd}>Add Review</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Product ID</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Approved</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell className="font-medium">{review.id}</TableCell>
              <TableCell>{review.userId}</TableCell>
              <TableCell>{review.productId}</TableCell>
              <TableCell>{review.rating}</TableCell>
              <TableCell>{review.title}</TableCell>
              <TableCell>{review.comment}</TableCell>
              <TableCell>{review.approved ? "Yes" : "No"}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(review)} variant="secondary" size="sm">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(review.id)} variant="destructive" size="sm">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          {editedReview && (
            <EditReviewForm review={editedReview} onSave={handleSave} onClose={() => setOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Review</DialogTitle>
          </DialogHeader>
          <AddReviewForm onCreate={handleCreate} onClose={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>
      <div className="flex justify-between">
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </Button>
        <Button onClick={() => setPage(page + 1)} disabled={page * pageSize >= totalCount}>
          Next
        </Button>
      </div>
    </ContentLayout>
  );
}

interface EditReviewFormProps {
  review: Review;
  onSave: (review: Review) => void;
  onClose: () => void;
}

const EditReviewForm: React.FC<EditReviewFormProps> = ({ review, onSave, onClose }) => {
  const [rating, setRating] = useState(review.rating);
  const [title, setTitle] = useState(review.title || "");
  const [comment, setComment] = useState(review.comment || "");
  const [approved, setApproved] = useState(review.approved);

  const handleSubmit = () => {
    onSave({ ...review, rating, title, comment, approved });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="rating" className="text-right">
          Rating
        </label>
        <Input id="rating" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="title" className="text-right">
          Title
        </label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="comment" className="text-right">
          Comment
        </label>
        <Input id="comment" value={comment} onChange={(e) => setComment(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="approved" className="text-right">
          Approved
        </label>
        <input type="checkbox" id="approved" checked={approved} onChange={(e) => setApproved(e.target.checked)} className="col-span-3" />
      </div>
      <Button onClick={handleSubmit}>Save</Button>
    </div>
  );
};

interface AddReviewFormProps {
  onCreate: (newReview: Omit<Review, "id">) => void;
  onClose: () => void;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({ onCreate, onClose }) => {
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [approved, setApproved] = useState(false);

  const handleSubmit = () => {
    onCreate({ userId, productId, rating, title, comment, approved });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="userId" className="text-right">
          User ID
        </label>
        <Input id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="productId" className="text-right">
          Product ID
        </label>
        <Input id="productId" value={productId} onChange={(e) => setProductId(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="rating" className="text-right">
          Rating
        </label>
        <Input id="rating" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="title" className="text-right">
          Title
        </label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="comment" className="text-right">
          Comment
        </label>
        <Input id="comment" value={comment} onChange={(e) => setComment(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="approved" className="text-right">
          Approved
        </label>
        <input type="checkbox" id="approved" checked={approved} onChange={(e) => setApproved(e.target.checked)} className="col-span-3" />
      </div>
      <Button onClick={handleSubmit}>Create</Button>
    </div>
  );
};
